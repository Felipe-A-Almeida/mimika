# Mimika

Jogo de mímica em português.

## Desenvolvimento

```bash
npm install
npm run dev
```

## Edge function `generate-category`

Configure no Supabase (secrets da função):

- `AI_CHAT_COMPLETIONS_URL` — URL compatível com OpenAI (`…/v1/chat/completions`)
- `AI_API_KEY` — chave Bearer para o provedor
- `AI_MODEL` — (opcional) identificador do modelo; padrão `google/gemini-2.5-flash` se o seu gateway usar esse nome
