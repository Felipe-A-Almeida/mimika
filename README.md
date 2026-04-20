# Mimika

Jogo de mímica em português.

## Desenvolvimento

```bash
cp .env.example .env
# Preencha VITE_SUPABASE_URL e VITE_SUPABASE_PUBLISHABLE_KEY
npm install
npm run dev
```

O build (`npm run build`) falha se `VITE_SUPABASE_URL` ou `VITE_SUPABASE_PUBLISHABLE_KEY` estiverem ausentes — defina-as no CI e no painel do host.

## Deploy do frontend (SPA)

Arquivos incluídos:

- **`vercel.json`** — rewrite para `index.html` (rotas do React).
- **`public/_redirects`** — mesmo efeito na Netlify (copiado para `dist` no build).

Configure as mesmas variáveis `VITE_*` no provedor de hospedagem antes do build.

## Edge function `generate-category`

Secrets no Supabase (Edge Functions):

| Variável | Descrição |
|----------|-----------|
| `AI_CHAT_COMPLETIONS_URL` | URL compatível com OpenAI (`…/v1/chat/completions`) |
| `AI_API_KEY` | Bearer do provedor de IA |
| `AI_MODEL` | (opcional) Modelo; padrão `google/gemini-2.5-flash` quando aplicável |
| `ALLOWED_ORIGIN` | (opcional) Origem exata do site em produção, ex. `https://seu-dominio.com`. Se omitido, CORS usa `*`. |

Outras variáveis automáticas do Supabase: `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`. Opcional: `IP_HASH_SALT` para o hash de IP no rate limit.

## Banco de dados

A função `public.cleanup_old_ai_rate_limits()` remove registros de rate limit com mais de 7 dias. Agende no painel (Cron/Extensions, se disponível) ou rode manualmente quando necessário.
