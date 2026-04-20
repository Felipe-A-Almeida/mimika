-- Habilita extensões para agendamento
CREATE EXTENSION IF NOT EXISTS pg_cron WITH SCHEMA extensions;
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Função para limpar registros antigos de rate limit (>7 dias)
CREATE OR REPLACE FUNCTION public.cleanup_old_ai_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.ai_category_rate_limits
  WHERE generated_at < now() - interval '7 days';
$$;

-- Agenda execução diária às 03:00 UTC
SELECT cron.schedule(
  'cleanup-ai-rate-limits-daily',
  '0 3 * * *',
  $$ SELECT public.cleanup_old_ai_rate_limits(); $$
);

-- Índice para acelerar consultas de rate limit
CREATE INDEX IF NOT EXISTS idx_ai_rate_limits_iphash_generated
  ON public.ai_category_rate_limits (ip_hash, generated_at DESC);