import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { z } from "https://esm.sh/zod@3.23.8";

const BodySchema = z.object({
  prompt: z.string().trim().min(3, "Mínimo 3 caracteres.").max(200, "Máximo 200 caracteres."),
  difficulty: z.enum(["facil", "medio", "dificil"]).default("medio"),
});

// Sanitiza strings vindas da IA: remove caracteres de controle e tags HTML básicas.
// NUNCA renderizar conteúdo da IA com dangerouslySetInnerHTML.
function sanitizeText(s: unknown, maxLen: number): string {
  return String(s ?? "")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, "")
    .trim()
    .slice(0, maxLen);
}

function buildCorsHeaders(): Record<string, string> {
  const origin = Deno.env.get("ALLOWED_ORIGIN")?.trim();
  return {
    "Access-Control-Allow-Origin":
      origin && origin.length > 0 ? origin : "*",
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

const DIFFICULTY_HINTS: Record<string, string> = {
  facil: "Palavras MUITO simples, conhecidas por crianças, fáceis de mimicar.",
  medio: "Palavras de dificuldade média, conhecidas pela maioria das pessoas.",
  dificil:
    "Palavras desafiadoras, criativas, mas ainda possíveis de mimicar (sem conceitos puramente abstratos).",
};

async function hashIp(ip: string): Promise<string> {
  const salt = Deno.env.get("IP_HASH_SALT") ?? "mimica-fallback-salt";
  const data = new TextEncoder().encode(ip + ":" + salt);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

Deno.serve(async (req) => {
  const cors = buildCorsHeaders();
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: cors });
  }

  try {
    const rawBody = await req.json().catch(() => null);
    const parsed = BodySchema.safeParse(rawBody);
    if (!parsed.success) {
      return new Response(
        JSON.stringify({ error: parsed.error.issues[0]?.message ?? "Entrada inválida." }),
        { status: 400, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }
    const prompt = parsed.data.prompt.replace(/\s+/g, " ");
    const difficulty = parsed.data.difficulty;

    // Identifica IP
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0].trim() ||
      req.headers.get("x-real-ip") ||
      "unknown";
    const ipHash = await hashIp(ip);

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Verifica rate limit (1x por dia)
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const { count, error: countErr } = await supabase
      .from("ai_category_rate_limits")
      .select("*", { count: "exact", head: true })
      .eq("ip_hash", ipHash)
      .gte("generated_at", since);

    if (countErr) {
      console.error("Erro ao verificar rate limit:", countErr);
    } else if ((count ?? 0) >= 1) {
      return new Response(
        JSON.stringify({
          error: "Você já gerou uma categoria nas últimas 24h. Volte amanhã!",
          rateLimited: true,
        }),
        { status: 429, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const aiUrl = Deno.env.get("AI_CHAT_COMPLETIONS_URL")?.trim();
    const aiKey = Deno.env.get("AI_API_KEY")?.trim();
    const aiModel =
      Deno.env.get("AI_MODEL")?.trim() || "google/gemini-2.5-flash";

    if (!aiUrl) {
      throw new Error("AI_CHAT_COMPLETIONS_URL não configurada");
    }
    if (!aiKey) {
      throw new Error("AI_API_KEY não configurada");
    }

    const difficultyHint = DIFFICULTY_HINTS[difficulty] ?? DIFFICULTY_HINTS.medio;

    const systemPrompt = `Você é um gerador de categorias para um jogo de mímica em português brasileiro.
Regras OBRIGATÓRIAS:
- Gere EXATAMENTE 50 palavras ou expressões curtas (1 a 3 palavras cada).
- Todas devem ser MIMICÁVEIS (objetos concretos, ações, profissões, animais, lugares, etc.). Evite conceitos abstratos puros.
- Conteúdo familiar, sem ofensas, sexo, drogas ou violência.
- Sem repetições. Sem numeração no texto da palavra.
- Sugira também um nome curto e atraente para a categoria (máx 30 chars) e UM emoji que a represente.
- ${difficultyHint}
- Se o pedido do usuário for ofensivo ou inadequado, recuse retornando uma categoria genérica de "Coisas do Dia a Dia".`;

    const aiResponse = await fetch(aiUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${aiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: aiModel,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: prompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "create_category",
              description: "Cria uma categoria de mímica com 50 palavras.",
              parameters: {
                type: "object",
                properties: {
                  name: { type: "string", description: "Nome curto da categoria" },
                  emoji: { type: "string", description: "Um único emoji representativo" },
                  words: {
                    type: "array",
                    items: { type: "string" },
                    minItems: 50,
                    maxItems: 50,
                    description: "Exatamente 50 palavras mimicáveis",
                  },
                },
                required: ["name", "emoji", "words"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: {
          type: "function",
          function: { name: "create_category" },
        },
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de uso da IA atingido, tente em alguns minutos." }),
          { status: 429, headers: { ...cors, "Content-Type": "application/json" } },
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos ou cota do provedor de IA esgotados." }),
          { status: 402, headers: { ...cors, "Content-Type": "application/json" } },
        );
      }
      const txt = await aiResponse.text();
      console.error("AI gateway error:", aiResponse.status, txt);
      return new Response(
        JSON.stringify({ error: "Erro ao gerar categoria." }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    const aiData = await aiResponse.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      console.error("Resposta sem tool_call:", JSON.stringify(aiData));
      return new Response(
        JSON.stringify({ error: "IA não retornou categoria válida." }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    let args: { name?: unknown; emoji?: unknown; words?: unknown };
    try {
      args = JSON.parse(toolCall.function.arguments);
    } catch {
      return new Response(
        JSON.stringify({ error: "Resposta da IA mal formatada." }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    // Sanitiza palavras: remove duplicatas, controla tamanho, remove tags HTML.
    const rawWords = Array.isArray(args.words) ? (args.words as unknown[]) : [];
    const cleanWords = Array.from(
      new Set(
        rawWords
          .map((w) => sanitizeText(w, 50))
          .filter((w) => w.length > 0),
      ),
    ).slice(0, 50);

    if (cleanWords.length < 10) {
      return new Response(
        JSON.stringify({ error: "IA retornou poucas palavras válidas. Tente outro prompt." }),
        { status: 500, headers: { ...cors, "Content-Type": "application/json" } },
      );
    }

    // Registra uso (após sucesso)
    await supabase.from("ai_category_rate_limits").insert({
      ip_hash: ipHash,
      prompt: prompt.slice(0, 200),
    });

    return new Response(
      JSON.stringify({
        name: sanitizeText(args.name, 30) || "Nova categoria",
        emoji: sanitizeText(args.emoji, 4) || "✨",
        words: cleanWords,
      }),
      { headers: { ...cors, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("generate-category error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...buildCorsHeaders(), "Content-Type": "application/json" },
      },
    );
  }
});
