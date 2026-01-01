
-- Primeiro, remover a tabela antiga
DROP TABLE IF EXISTS public.ordens_servico CASCADE;

-- Criar enum para roles
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Criar enum para status geral
CREATE TYPE public.status_geral AS ENUM ('pendente', 'aprovado', 'rejeitado', 'ativo', 'inativo', 'concluido', 'cancelado', 'andamento');

-- Criar enum para tipo de veículo
CREATE TYPE public.tipo_veiculo AS ENUM ('carro', 'moto', 'ambos');

-- Criar enum para tipo de documento
CREATE TYPE public.tipo_documento AS ENUM ('cpf', 'cnpj');

-- Criar enum para forma de pagamento
CREATE TYPE public.forma_pagamento AS ENUM ('pix', 'cartao_credito', 'cartao_debito', 'boleto', 'dinheiro', 'transferencia');

-- =====================================================
-- TABELA: user_roles (para controle de acesso admin)
-- =====================================================
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Função para verificar role (evita recursão em RLS)
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- =====================================================
-- TABELA: clientes
-- =====================================================
CREATE TABLE public.clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT,
    telefone TEXT,
    whatsapp TEXT,
    documento TEXT,
    tipo_documento tipo_documento DEFAULT 'cpf',
    cep TEXT,
    endereco TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    observacoes TEXT,
    status status_geral DEFAULT 'ativo',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: prestadores_servico
-- =====================================================
CREATE TABLE public.prestadores_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    telefone TEXT NOT NULL,
    whatsapp TEXT,
    documento TEXT NOT NULL,
    tipo_documento tipo_documento NOT NULL,
    tipo_veiculo tipo_veiculo NOT NULL,
    placa_veiculo TEXT,
    cep TEXT NOT NULL,
    endereco TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    qualificacoes TEXT[] DEFAULT '{}',
    fotos_obras TEXT[] DEFAULT '{}',
    cnh_urls TEXT[] DEFAULT '{}',
    nota_media DECIMAL(3, 2) DEFAULT 0,
    total_servicos INTEGER DEFAULT 0,
    valor_ganhos DECIMAL(12, 2) DEFAULT 0,
    pix_chave TEXT,
    banco_nome TEXT,
    banco_agencia TEXT,
    banco_conta TEXT,
    observacoes TEXT,
    status status_geral DEFAULT 'pendente',
    data_aprovacao TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.prestadores_servico ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: vidracarias
-- =====================================================
CREATE TABLE public.vidracarias (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    razao_social TEXT NOT NULL,
    nome_fantasia TEXT,
    cnpj TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL,
    telefone TEXT NOT NULL,
    whatsapp TEXT,
    responsavel_nome TEXT,
    responsavel_telefone TEXT,
    cep TEXT NOT NULL,
    endereco TEXT,
    numero TEXT,
    complemento TEXT,
    bairro TEXT,
    cidade TEXT,
    estado TEXT,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    comissao_percentual DECIMAL(5, 2) DEFAULT 10.00,
    pix_chave TEXT,
    banco_nome TEXT,
    banco_agencia TEXT,
    banco_conta TEXT,
    total_indicacoes INTEGER DEFAULT 0,
    valor_comissoes DECIMAL(12, 2) DEFAULT 0,
    observacoes TEXT,
    status status_geral DEFAULT 'pendente',
    data_aprovacao TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.vidracarias ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: servicos (tipos de serviços disponíveis)
-- =====================================================
CREATE TABLE public.servicos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    descricao TEXT,
    tipo TEXT NOT NULL, -- 'manutencao' ou 'pelicula'
    valor_base DECIMAL(10, 2) DEFAULT 0,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.servicos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: box_clientes (boxes dos clientes)
-- =====================================================
CREATE TABLE public.box_clientes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE CASCADE NOT NULL,
    ambiente TEXT NOT NULL,
    tipo_box TEXT,
    foto_url TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.box_clientes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: ordens_servico
-- =====================================================
CREATE TABLE public.ordens_servico (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    prestador_id UUID REFERENCES public.prestadores_servico(id) ON DELETE SET NULL,
    vidracaria_id UUID REFERENCES public.vidracarias(id) ON DELETE SET NULL,
    numero_ordem TEXT UNIQUE,
    status status_geral DEFAULT 'pendente',
    data_solicitacao TIMESTAMPTZ NOT NULL DEFAULT now(),
    data_agendamento DATE,
    data_inicio TIMESTAMPTZ,
    data_conclusao TIMESTAMPTZ,
    valor_total DECIMAL(12, 2) DEFAULT 0,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.ordens_servico ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: processo_manutencao
-- =====================================================
CREATE TABLE public.processo_manutencao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    box_id UUID REFERENCES public.box_clientes(id) ON DELETE SET NULL,
    valor DECIMAL(10, 2) DEFAULT 0,
    foto_inicial TEXT,
    analise_concluida BOOLEAN DEFAULT false,
    analise_texto TEXT,
    trilho_analisado BOOLEAN DEFAULT false,
    foto_trilho TEXT,
    roldanas_trocadas BOOLEAN DEFAULT false,
    foto_roldanas TEXT,
    vidro_analisado BOOLEAN DEFAULT false,
    vidro_trincas BOOLEAN DEFAULT false,
    vidro_substituir BOOLEAN DEFAULT false,
    foto_vidro TEXT,
    remontagem_concluida BOOLEAN DEFAULT false,
    foto_final TEXT,
    assinatura_prestador TEXT,
    concluido BOOLEAN DEFAULT false,
    data_conclusao TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.processo_manutencao ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: processo_pelicula
-- =====================================================
CREATE TABLE public.processo_pelicula (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    box_id UUID REFERENCES public.box_clientes(id) ON DELETE SET NULL,
    valor DECIMAL(10, 2) DEFAULT 0,
    foto_geral TEXT,
    condicoes_verificadas BOOLEAN DEFAULT false,
    limpeza_feita BOOLEAN DEFAULT false,
    porta_retirada BOOLEAN DEFAULT false,
    porta_aplicada BOOLEAN DEFAULT false,
    foto_porta TEXT,
    vidro_fixo_aplicado BOOLEAN DEFAULT false,
    foto_vidro_fixo TEXT,
    remontagem_concluida BOOLEAN DEFAULT false,
    foto_final TEXT,
    concluido BOOLEAN DEFAULT false,
    data_conclusao TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.processo_pelicula ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: orcamentos
-- =====================================================
CREATE TABLE public.orcamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    valor_manutencao DECIMAL(10, 2) DEFAULT 0,
    valor_pelicula DECIMAL(10, 2) DEFAULT 0,
    valor_desconto DECIMAL(10, 2) DEFAULT 0,
    valor_total DECIMAL(12, 2) DEFAULT 0,
    status status_geral DEFAULT 'pendente',
    data_aprovacao TIMESTAMPTZ,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.orcamentos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: certificados
-- =====================================================
CREATE TABLE public.certificados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    prestador_id UUID REFERENCES public.prestadores_servico(id) ON DELETE SET NULL,
    numero_certificado TEXT UNIQUE,
    pdf_url TEXT,
    data_geracao TIMESTAMPTZ DEFAULT now(),
    data_envio TIMESTAMPTZ,
    enviado_email BOOLEAN DEFAULT false,
    data_validade DATE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.certificados ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: agendamentos
-- =====================================================
CREATE TABLE public.agendamentos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    prestador_id UUID REFERENCES public.prestadores_servico(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    data_agendada DATE NOT NULL,
    hora_inicio TIME,
    hora_fim TIME,
    status status_geral DEFAULT 'pendente',
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: avaliacoes
-- =====================================================
CREATE TABLE public.avaliacoes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE CASCADE NOT NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    prestador_id UUID REFERENCES public.prestadores_servico(id) ON DELETE SET NULL,
    nota INTEGER CHECK (nota >= 1 AND nota <= 5),
    comentario TEXT,
    data_avaliacao TIMESTAMPTZ DEFAULT now(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.avaliacoes ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: financeiro
-- =====================================================
CREATE TABLE public.financeiro (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ordem_id UUID REFERENCES public.ordens_servico(id) ON DELETE SET NULL,
    cliente_id UUID REFERENCES public.clientes(id) ON DELETE SET NULL,
    prestador_id UUID REFERENCES public.prestadores_servico(id) ON DELETE SET NULL,
    vidracaria_id UUID REFERENCES public.vidracarias(id) ON DELETE SET NULL,
    tipo TEXT NOT NULL, -- 'receita', 'despesa', 'comissao_prestador', 'comissao_vidracaria'
    descricao TEXT,
    valor DECIMAL(12, 2) NOT NULL,
    forma_pagamento forma_pagamento,
    data_vencimento DATE,
    data_pagamento DATE,
    status status_geral DEFAULT 'pendente',
    comprovante_url TEXT,
    observacoes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TABELA: mapa_gps (localizações para o mapa)
-- =====================================================
CREATE TABLE public.mapa_gps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tipo TEXT NOT NULL, -- 'cliente', 'prestador', 'vidracaria', 'ordem'
    referencia_id UUID NOT NULL,
    nome TEXT,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    endereco_completo TEXT,
    icone TEXT,
    cor TEXT,
    ativo BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.mapa_gps ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- TRIGGERS para updated_at
-- =====================================================
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_prestadores_updated_at BEFORE UPDATE ON public.prestadores_servico FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_vidracarias_updated_at BEFORE UPDATE ON public.vidracarias FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_servicos_updated_at BEFORE UPDATE ON public.servicos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_box_clientes_updated_at BEFORE UPDATE ON public.box_clientes FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_ordens_updated_at BEFORE UPDATE ON public.ordens_servico FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_processo_manutencao_updated_at BEFORE UPDATE ON public.processo_manutencao FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_processo_pelicula_updated_at BEFORE UPDATE ON public.processo_pelicula FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_orcamentos_updated_at BEFORE UPDATE ON public.orcamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_financeiro_updated_at BEFORE UPDATE ON public.financeiro FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER update_mapa_gps_updated_at BEFORE UPDATE ON public.mapa_gps FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- RLS POLICIES
-- =====================================================

-- User roles: admin pode tudo, user pode ver o próprio
CREATE POLICY "Admin full access" ON public.user_roles FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Users can view own role" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);

-- Clientes: público pode inserir, admin pode tudo, cliente pode ver/editar próprio
CREATE POLICY "Public insert clientes" ON public.clientes FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access clientes" ON public.clientes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente own access" ON public.clientes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Cliente own update" ON public.clientes FOR UPDATE USING (auth.uid() = user_id);

-- Prestadores: público pode inserir (cadastro), admin pode tudo, prestador pode ver/editar próprio
CREATE POLICY "Public insert prestadores" ON public.prestadores_servico FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access prestadores" ON public.prestadores_servico FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Prestador own access" ON public.prestadores_servico FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Prestador own update" ON public.prestadores_servico FOR UPDATE USING (auth.uid() = user_id);

-- Vidracarias: público pode inserir, admin pode tudo, vidracaria pode ver/editar próprio
CREATE POLICY "Public insert vidracarias" ON public.vidracarias FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin full access vidracarias" ON public.vidracarias FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Vidracaria own access" ON public.vidracarias FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Vidracaria own update" ON public.vidracarias FOR UPDATE USING (auth.uid() = user_id);

-- Servicos: todos podem ler, admin pode tudo
CREATE POLICY "Public read servicos" ON public.servicos FOR SELECT USING (true);
CREATE POLICY "Admin full access servicos" ON public.servicos FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Box clientes: admin pode tudo, cliente dono pode CRUD
CREATE POLICY "Admin full access box" ON public.box_clientes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Cliente own box access" ON public.box_clientes FOR ALL USING (
    EXISTS (SELECT 1 FROM public.clientes WHERE id = box_clientes.cliente_id AND user_id = auth.uid())
);

-- Ordens: admin pode tudo, cliente/prestador envolvido pode ver
CREATE POLICY "Admin full access ordens" ON public.ordens_servico FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read ordens" ON public.ordens_servico FOR SELECT USING (true);
CREATE POLICY "Public insert ordens" ON public.ordens_servico FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update ordens" ON public.ordens_servico FOR UPDATE USING (true);

-- Processos: admin pode tudo, prestador pode atualizar
CREATE POLICY "Admin full access manutencao" ON public.processo_manutencao FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public access manutencao" ON public.processo_manutencao FOR ALL USING (true);

CREATE POLICY "Admin full access pelicula" ON public.processo_pelicula FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public access pelicula" ON public.processo_pelicula FOR ALL USING (true);

-- Orçamentos
CREATE POLICY "Admin full access orcamentos" ON public.orcamentos FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read orcamentos" ON public.orcamentos FOR SELECT USING (true);
CREATE POLICY "Public insert orcamentos" ON public.orcamentos FOR INSERT WITH CHECK (true);

-- Certificados
CREATE POLICY "Admin full access certificados" ON public.certificados FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read certificados" ON public.certificados FOR SELECT USING (true);
CREATE POLICY "Public insert certificados" ON public.certificados FOR INSERT WITH CHECK (true);

-- Agendamentos
CREATE POLICY "Admin full access agendamentos" ON public.agendamentos FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public access agendamentos" ON public.agendamentos FOR ALL USING (true);

-- Avaliações
CREATE POLICY "Admin full access avaliacoes" ON public.avaliacoes FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public read avaliacoes" ON public.avaliacoes FOR SELECT USING (true);
CREATE POLICY "Public insert avaliacoes" ON public.avaliacoes FOR INSERT WITH CHECK (true);

-- Financeiro: apenas admin
CREATE POLICY "Admin full access financeiro" ON public.financeiro FOR ALL USING (public.has_role(auth.uid(), 'admin'));

-- Mapa GPS: todos podem ler, admin pode tudo
CREATE POLICY "Public read mapa" ON public.mapa_gps FOR SELECT USING (true);
CREATE POLICY "Admin full access mapa" ON public.mapa_gps FOR ALL USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Public insert mapa" ON public.mapa_gps FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update mapa" ON public.mapa_gps FOR UPDATE USING (true);

-- =====================================================
-- STORAGE BUCKETS
-- =====================================================
INSERT INTO storage.buckets (id, name, public) VALUES ('prestadores-fotos', 'prestadores-fotos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('prestadores-cnh', 'prestadores-cnh', false) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('clientes-fotos', 'clientes-fotos', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('certificados', 'certificados', true) ON CONFLICT DO NOTHING;
INSERT INTO storage.buckets (id, name, public) VALUES ('comprovantes', 'comprovantes', false) ON CONFLICT DO NOTHING;

-- Storage policies
CREATE POLICY "Public read prestadores-fotos" ON storage.objects FOR SELECT USING (bucket_id = 'prestadores-fotos');
CREATE POLICY "Public upload prestadores-fotos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'prestadores-fotos');
CREATE POLICY "Public read clientes-fotos" ON storage.objects FOR SELECT USING (bucket_id = 'clientes-fotos');
CREATE POLICY "Public upload clientes-fotos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'clientes-fotos');
CREATE POLICY "Public read certificados" ON storage.objects FOR SELECT USING (bucket_id = 'certificados');
CREATE POLICY "Public upload certificados" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'certificados');
CREATE POLICY "Admin read cnh" ON storage.objects FOR SELECT USING (bucket_id = 'prestadores-cnh');
CREATE POLICY "Public upload cnh" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'prestadores-cnh');

-- =====================================================
-- DADOS INICIAIS DE SERVIÇOS
-- =====================================================
INSERT INTO public.servicos (nome, descricao, tipo, valor_base, ativo) VALUES
('Manutenção Anual', 'Manutenção preventiva anual do box', 'manutencao', 150.00, true),
('Troca de Roldanas', 'Substituição de roldanas desgastadas', 'manutencao', 80.00, true),
('Película de Segurança', 'Aplicação de película de segurança', 'pelicula', 200.00, true),
('Película Anti-UV', 'Aplicação de película anti raios UV', 'pelicula', 250.00, true);
