-- ============================================
-- SCHEMA SUPABASE - SISTEMA MULTI-OBS SAÚDE
-- ============================================

-- 1. TABELA: obs (Organizações Básicas de Saúde)
-- ============================================
CREATE TABLE obs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nome TEXT NOT NULL,
    cidade TEXT NOT NULL,
    estado TEXT NOT NULL CHECK (length(estado) = 2),
    cnpj TEXT UNIQUE,
    telefone TEXT,
    email TEXT,
    dominio TEXT UNIQUE,
    webhook_whatsapp TEXT,
    logo_url TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
    plano TEXT DEFAULT 'basico' CHECK (plano IN ('basico', 'premium', 'enterprise')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABELA: usuarios (Usuários do Sistema)
-- ==========================================
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    obs_id UUID REFERENCES obs(id) ON DELETE CASCADE,
    nome TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    telefone TEXT,
    tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('superadmin', 'admin_obs', 'agente_saude', 'populacao')),
    posto_saude TEXT,
    foto_url TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- SuperAdmin não precisa ter OBS
    CONSTRAINT check_obs_requirement CHECK (
        (tipo_usuario = 'superadmin' AND obs_id IS NULL) OR
        (tipo_usuario != 'superadmin' AND obs_id IS NOT NULL)
    )
);

-- 3. TABELA: eventos_saude (Eventos e Campanhas)
-- ===============================================
CREATE TABLE eventos_saude (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obs_id UUID REFERENCES obs(id) ON DELETE CASCADE NOT NULL,
    tipo TEXT NOT NULL CHECK (tipo IN ('vacina', 'campanha', 'palestra', 'exame', 'atendimento')),
    titulo TEXT NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    horario_inicio TIME,
    horario_fim TIME,
    posto_saude TEXT,
    endereco TEXT,
    profissional_responsavel TEXT,
    vagas_total INTEGER CHECK (vagas_total > 0),
    vagas_ocupadas INTEGER DEFAULT 0 CHECK (vagas_ocupadas >= 0),
    publico_alvo TEXT,
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado', 'concluido')),
    criado_por UUID REFERENCES usuarios(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Verificar se vagas ocupadas não excedem o total
    CONSTRAINT check_vagas CHECK (vagas_ocupadas <= vagas_total OR vagas_total IS NULL)
);

-- 4. TABELA: medicos_disponiveis (Médicos e Especialistas)
-- =========================================================
CREATE TABLE medicos_disponiveis (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obs_id UUID REFERENCES obs(id) ON DELETE CASCADE NOT NULL,
    nome TEXT NOT NULL,
    crm TEXT,
    especialidade TEXT NOT NULL,
    posto_saude TEXT NOT NULL,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    vagas_total INTEGER DEFAULT 20 CHECK (vagas_total > 0),
    vagas_ocupadas INTEGER DEFAULT 0 CHECK (vagas_ocupadas >= 0),
    status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado')),
    observacoes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Verificar se vagas ocupadas não excedem o total
    CONSTRAINT check_medico_vagas CHECK (vagas_ocupadas <= vagas_total),
    -- Verificar se horário fim é após horário início
    CONSTRAINT check_horario_medico CHECK (horario_fim > horario_inicio)
);

-- 5. TABELA: duvidas_populacao (Dúvidas da População)
-- ===================================================
CREATE TABLE duvidas_populacao (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obs_id UUID REFERENCES obs(id) ON DELETE CASCADE NOT NULL,
    nome_pessoa TEXT NOT NULL,
    email TEXT,
    numero_whatsapp TEXT,
    categoria TEXT CHECK (categoria IN ('vacina', 'atendimento', 'medicamento', 'emergencia', 'outro')),
    pergunta TEXT NOT NULL,
    resposta TEXT,
    status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'respondida', 'arquivada')),
    prioridade TEXT DEFAULT 'normal' CHECK (prioridade IN ('baixa', 'normal', 'alta', 'urgente')),
    respondido_por UUID REFERENCES usuarios(id),
    data_pergunta TIMESTAMPTZ DEFAULT NOW(),
    data_resposta TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Verificar se data da resposta é após a pergunta
    CONSTRAINT check_data_resposta CHECK (data_resposta >= data_pergunta OR data_resposta IS NULL),
    -- Se respondida, deve ter resposta e respondente
    CONSTRAINT check_resposta_completa CHECK (
        (status = 'respondida' AND resposta IS NOT NULL AND respondido_por IS NOT NULL AND data_resposta IS NOT NULL) OR
        (status != 'respondida')
    )
);

-- 6. TABELA: logs_auditoria (Logs do Sistema)
-- ============================================
CREATE TABLE logs_auditoria (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    obs_id UUID REFERENCES obs(id) ON DELETE CASCADE,
    usuario_id UUID REFERENCES usuarios(id),
    acao TEXT NOT NULL,
    tabela TEXT NOT NULL,
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================

-- Índices para obs
CREATE INDEX idx_obs_status ON obs(status);
CREATE INDEX idx_obs_cidade_estado ON obs(cidade, estado);

-- Índices para usuarios
CREATE INDEX idx_usuarios_obs_id ON usuarios(obs_id);
CREATE INDEX idx_usuarios_tipo ON usuarios(tipo_usuario);
CREATE INDEX idx_usuarios_email ON usuarios(email);
CREATE INDEX idx_usuarios_auth_id ON usuarios(auth_id);

-- Índices para eventos_saude
CREATE INDEX idx_eventos_obs_id ON eventos_saude(obs_id);
CREATE INDEX idx_eventos_data ON eventos_saude(data_inicio);
CREATE INDEX idx_eventos_status ON eventos_saude(status);
CREATE INDEX idx_eventos_tipo ON eventos_saude(tipo);

-- Índices para medicos_disponiveis
CREATE INDEX idx_medicos_obs_id ON medicos_disponiveis(obs_id);
CREATE INDEX idx_medicos_data ON medicos_disponiveis(data);
CREATE INDEX idx_medicos_especialidade ON medicos_disponiveis(especialidade);

-- Índices para duvidas_populacao
CREATE INDEX idx_duvidas_obs_id ON duvidas_populacao(obs_id);
CREATE INDEX idx_duvidas_status ON duvidas_populacao(status);
CREATE INDEX idx_duvidas_data ON duvidas_populacao(data_pergunta);

-- Índices para logs_auditoria
CREATE INDEX idx_logs_obs_id ON logs_auditoria(obs_id);
CREATE INDEX idx_logs_usuario_id ON logs_auditoria(usuario_id);
CREATE INDEX idx_logs_data ON logs_auditoria(created_at);

-- ============================================
-- FUNÇÕES TRIGGER PARA UPDATED_AT
-- ============================================

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers para atualizar updated_at
CREATE TRIGGER trigger_obs_updated_at BEFORE UPDATE ON obs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_eventos_updated_at BEFORE UPDATE ON eventos_saude FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trigger_medicos_updated_at BEFORE UPDATE ON medicos_disponiveis FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- ROW LEVEL SECURITY (RLS) - POLÍTICAS
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE obs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_saude ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicos_disponiveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvidas_populacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE logs_auditoria ENABLE ROW LEVEL SECURITY;

-- ============================================
-- POLÍTICAS RLS - TABELA OBS
-- ============================================

-- SuperAdmin vê todas as OBS
CREATE POLICY "superadmin_all_obs" ON obs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE usuarios.auth_id = auth.uid() 
        AND usuarios.tipo_usuario = 'superadmin'
    )
);

-- Admin e Agente veem apenas sua OBS
CREATE POLICY "users_own_obs" ON obs
FOR SELECT USING (
    id IN (
        SELECT obs_id FROM usuarios 
        WHERE auth_id = auth.uid()
        AND obs_id IS NOT NULL
    )
);

-- ============================================
-- POLÍTICAS RLS - TABELA USUARIOS
-- ============================================

-- SuperAdmin vê todos os usuários
CREATE POLICY "superadmin_all_users" ON usuarios
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM usuarios u2
        WHERE u2.auth_id = auth.uid() 
        AND u2.tipo_usuario = 'superadmin'
    )
);

-- Admin vê usuários da sua OBS
CREATE POLICY "admin_own_obs_users" ON usuarios
FOR ALL USING (
    obs_id IN (
        SELECT obs_id FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario IN ('admin_obs', 'superadmin')
    )
);

-- Usuário vê apenas seu próprio perfil
CREATE POLICY "users_own_profile" ON usuarios
FOR ALL USING (auth_id = auth.uid());

-- ============================================
-- POLÍTICAS RLS - TABELA EVENTOS_SAUDE
-- ============================================

-- População vê eventos ativos (sem autenticação)
CREATE POLICY "public_view_active_events" ON eventos_saude
FOR SELECT USING (status = 'ativo');

-- Staff da OBS gerencia eventos da sua OBS
CREATE POLICY "staff_manage_obs_events" ON eventos_saude
FOR ALL USING (
    obs_id IN (
        SELECT obs_id FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario IN ('admin_obs', 'agente_saude', 'superadmin')
        AND obs_id IS NOT NULL
    ) OR
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario = 'superadmin'
    )
);

-- ============================================
-- POLÍTICAS RLS - TABELA MEDICOS_DISPONIVEIS
-- ============================================

-- População vê médicos ativos
CREATE POLICY "public_view_active_doctors" ON medicos_disponiveis
FOR SELECT USING (status = 'ativo');

-- Staff da OBS gerencia médicos da sua OBS
CREATE POLICY "staff_manage_obs_doctors" ON medicos_disponiveis
FOR ALL USING (
    obs_id IN (
        SELECT obs_id FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario IN ('admin_obs', 'agente_saude', 'superadmin')
        AND obs_id IS NOT NULL
    ) OR
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario = 'superadmin'
    )
);

-- ============================================
-- POLÍTICAS RLS - TABELA DUVIDAS_POPULACAO
-- ============================================

-- Staff da OBS vê dúvidas da sua OBS
CREATE POLICY "staff_view_obs_questions" ON duvidas_populacao
FOR ALL USING (
    obs_id IN (
        SELECT obs_id FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario IN ('admin_obs', 'agente_saude')
        AND obs_id IS NOT NULL
    ) OR
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario = 'superadmin'
    )
);

-- População pode criar dúvidas (INSERT apenas)
CREATE POLICY "public_create_questions" ON duvidas_populacao
FOR INSERT WITH CHECK (true);

-- ============================================
-- POLÍTICAS RLS - TABELA LOGS_AUDITORIA
-- ============================================

-- Apenas SuperAdmin e Admin da OBS veem logs
CREATE POLICY "admin_view_logs" ON logs_auditoria
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario = 'superadmin'
    ) OR
    obs_id IN (
        SELECT obs_id FROM usuarios 
        WHERE auth_id = auth.uid() 
        AND tipo_usuario = 'admin_obs'
        AND obs_id IS NOT NULL
    )
);

-- Sistema pode inserir logs
CREATE POLICY "system_insert_logs" ON logs_auditoria
FOR INSERT WITH CHECK (true);

-- ============================================
-- DADOS INICIAIS (SEED)
-- ============================================

-- Inserir OBS de exemplo
INSERT INTO obs (nome, cidade, estado, status, plano, email) VALUES
('OBS São Paulo Centro', 'São Paulo', 'SP', 'ativo', 'premium', 'contato@obssp.gov.br'),
('OBS Rio de Janeiro', 'Rio de Janeiro', 'RJ', 'ativo', 'basico', 'contato@obsrj.gov.br'),
('OBS Belo Horizonte', 'Belo Horizonte', 'MG', 'ativo', 'basico', 'contato@obsmg.gov.br');

-- ============================================
-- COMENTÁRIOS E METADADOS
-- ============================================

COMMENT ON TABLE obs IS 'Organizações Básicas de Saúde - Entidades principais do sistema multi-tenant';
COMMENT ON TABLE usuarios IS 'Usuários do sistema com 4 tipos: SuperAdmin, Admin OBS, Agente Saúde, População';
COMMENT ON TABLE eventos_saude IS 'Eventos de saúde como vacinação, campanhas, palestras organizadas pelas OBS';
COMMENT ON TABLE medicos_disponiveis IS 'Médicos e especialistas disponíveis para atendimento em cada OBS';
COMMENT ON TABLE duvidas_populacao IS 'Dúvidas e perguntas enviadas pela população às OBS';
COMMENT ON TABLE logs_auditoria IS 'Logs de auditoria para rastreamento de ações no sistema';