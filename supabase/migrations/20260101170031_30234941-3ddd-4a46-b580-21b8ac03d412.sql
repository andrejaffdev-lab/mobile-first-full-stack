-- Criar bucket para fotos das ordens de serviço
INSERT INTO storage.buckets (id, name, public)
VALUES ('ordem-fotos', 'ordem-fotos', true);

-- Política para permitir upload de fotos autenticados
CREATE POLICY "Authenticated users can upload photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'ordem-fotos');

-- Política para visualização pública
CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'ordem-fotos');

-- Política para usuários autenticados deletarem suas fotos
CREATE POLICY "Authenticated users can delete photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'ordem-fotos');

-- Criar tabela de ordens de serviço
CREATE TABLE public.ordens_servico (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  
  -- Dados do Cliente
  cliente_nome TEXT NOT NULL,
  cliente_telefone TEXT,
  cliente_email TEXT,
  cliente_cep TEXT,
  cliente_endereco TEXT,
  cliente_numero TEXT,
  cliente_complemento TEXT,
  cliente_bairro TEXT,
  cliente_cidade TEXT,
  cliente_estado TEXT,
  
  -- Tipo de Serviço
  manutencao_anual BOOLEAN DEFAULT false,
  colocacao_pelicula BOOLEAN DEFAULT false,
  local_box TEXT,
  
  -- Foto inicial do box
  foto_box_inicial TEXT,
  
  -- Datas
  data_solicitacao TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  data_agendamento DATE,
  data_contato_prestador DATE,
  data_conclusao TIMESTAMP WITH TIME ZONE,
  
  -- Prestador
  prestador_id UUID,
  prestador_nome TEXT,
  prestador_telefone TEXT,
  
  -- Checklist Manutenção Anual
  manut_foto_inicial TEXT,
  manut_analise_texto TEXT,
  manut_analise_concluida BOOLEAN DEFAULT false,
  manut_roldanas_trocadas BOOLEAN DEFAULT false,
  manut_foto_roldanas TEXT,
  manut_trilho_analisado BOOLEAN DEFAULT false,
  manut_foto_trilho TEXT,
  manut_vidro_analisado BOOLEAN DEFAULT false,
  manut_vidro_trincas BOOLEAN DEFAULT false,
  manut_vidro_substituir BOOLEAN DEFAULT false,
  manut_foto_vidro TEXT,
  manut_remontagem_concluida BOOLEAN DEFAULT false,
  manut_foto_final TEXT,
  manut_assinatura_prestador TEXT,
  manut_concluida BOOLEAN DEFAULT false,
  
  -- Checklist Película
  pelicula_foto_geral TEXT,
  pelicula_condicoes_verificadas BOOLEAN DEFAULT false,
  pelicula_limpeza_feita BOOLEAN DEFAULT false,
  pelicula_porta_retirada BOOLEAN DEFAULT false,
  pelicula_porta_aplicada BOOLEAN DEFAULT false,
  pelicula_vidro_fixo_aplicado BOOLEAN DEFAULT false,
  pelicula_foto_porta TEXT,
  pelicula_foto_vidro_fixo TEXT,
  pelicula_remontagem_concluida BOOLEAN DEFAULT false,
  pelicula_foto_final TEXT,
  pelicula_concluida BOOLEAN DEFAULT false,
  
  -- Certificado
  certificado_gerado BOOLEAN DEFAULT false,
  certificado_enviado BOOLEAN DEFAULT false,
  certificado_pdf_url TEXT,
  
  -- Financeiro
  valor_manutencao DECIMAL(10,2),
  valor_pelicula DECIMAL(10,2),
  valor_total DECIMAL(10,2),
  data_pagamento DATE,
  forma_pagamento TEXT,
  
  -- Avaliação
  avaliacao_cliente INTEGER CHECK (avaliacao_cliente >= 0 AND avaliacao_cliente <= 5),
  
  -- Status
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'agendado', 'andamento', 'concluido', 'cancelado')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

-- Por enquanto, política pública para testes (ajustar depois com auth)
CREATE POLICY "Public read access for ordens"
ON public.ordens_servico FOR SELECT
USING (true);

CREATE POLICY "Public insert access for ordens"
ON public.ordens_servico FOR INSERT
WITH CHECK (true);

CREATE POLICY "Public update access for ordens"
ON public.ordens_servico FOR UPDATE
USING (true);

CREATE POLICY "Public delete access for ordens"
ON public.ordens_servico FOR DELETE
USING (true);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ordens_servico_updated_at
  BEFORE UPDATE ON public.ordens_servico
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();