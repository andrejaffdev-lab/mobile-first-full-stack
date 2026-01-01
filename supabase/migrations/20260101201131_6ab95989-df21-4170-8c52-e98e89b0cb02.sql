-- Tabela de mensagens para chat
CREATE TABLE public.mensagens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  remetente_id UUID NOT NULL,
  remetente_tipo TEXT NOT NULL CHECK (remetente_tipo IN ('admin', 'cliente', 'prestador', 'vidracaria')),
  destinatario_id UUID,
  destinatario_tipo TEXT CHECK (destinatario_tipo IN ('admin', 'cliente', 'prestador', 'vidracaria')),
  conteudo TEXT NOT NULL,
  lida BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Índices para performance
CREATE INDEX idx_mensagens_remetente ON public.mensagens(remetente_id, remetente_tipo);
CREATE INDEX idx_mensagens_destinatario ON public.mensagens(destinatario_id, destinatario_tipo);
CREATE INDEX idx_mensagens_created_at ON public.mensagens(created_at DESC);

-- RLS
ALTER TABLE public.mensagens ENABLE ROW LEVEL SECURITY;

-- Admin pode ver e gerenciar todas as mensagens
CREATE POLICY "Admin full access mensagens"
  ON public.mensagens FOR ALL
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Usuários podem ver mensagens onde são remetente ou destinatário
CREATE POLICY "Users can view own messages"
  ON public.mensagens FOR SELECT
  USING (
    remetente_id = auth.uid() OR destinatario_id = auth.uid()
  );

-- Usuários podem enviar mensagens
CREATE POLICY "Users can send messages"
  ON public.mensagens FOR INSERT
  WITH CHECK (remetente_id = auth.uid());

-- Habilitar realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.mensagens;