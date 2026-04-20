-- Limpeza de registros antigos de rate limit (>7 dias).
-- Para agendar (ex.: diário), use o painel do Supabase ou execute manualmente:
--   SELECT public.cleanup_old_ai_rate_limits();
CREATE OR REPLACE FUNCTION public.cleanup_old_ai_rate_limits()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  DELETE FROM public.ai_category_rate_limits
  WHERE generated_at < now() - interval '7 days';
$$;
