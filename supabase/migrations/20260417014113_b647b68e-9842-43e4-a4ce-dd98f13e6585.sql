-- Tabela para controlar rate limit de geração de categorias por IA
CREATE TABLE public.ai_category_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_hash TEXT NOT NULL,
  generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  prompt TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_ai_rate_limits_ip_date ON public.ai_category_rate_limits (ip_hash, generated_at DESC);

ALTER TABLE public.ai_category_rate_limits ENABLE ROW LEVEL SECURITY;

-- Apenas a edge function (service role) lê/escreve. Nenhum acesso direto do cliente.
CREATE POLICY "No client access to rate limits"
ON public.ai_category_rate_limits
FOR ALL
USING (false)
WITH CHECK (false);