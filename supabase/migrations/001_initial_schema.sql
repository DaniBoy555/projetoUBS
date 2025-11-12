-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE tipo_usuario AS ENUM ('superadmin', 'admin_obs', 'agente_saude', 'populacao');
CREATE TYPE status_usuario AS ENUM ('ativo', 'inativo');
CREATE TYPE tipo_evento AS ENUM ('vacina', 'campanha', 'palestra', 'exame', 'atendimento');
CREATE TYPE status_obs AS ENUM ('ativo', 'inativo', 'suspenso');
CREATE TYPE plano_obs AS ENUM ('basico', 'premium', 'enterprise');
CREATE TYPE status_evento AS ENUM ('ativo', 'cancelado', 'concluido');
CREATE TYPE categoria_duvida AS ENUM ('vacina', 'atendimento', 'medicamento', 'outro');
CREATE TYPE status_duvida AS ENUM ('pendente', 'respondida', 'arquivada');

-- Tabela de OBS (Organizações Básicas de Saúde)
CREATE TABLE obs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nome VARCHAR(255) NOT NULL,
    cidade VARCHAR(100) NOT NULL,
    estado CHAR(2) NOT NULL,
    cnpj VARCHAR(18) UNIQUE,
    telefone VARCHAR(20),
    email VARCHAR(255),
    dominio VARCHAR(255),
    webhook_whatsapp TEXT,
    logo_url TEXT,
    status status_obs DEFAULT 'ativo',
    plano plano_obs DEFAULT 'basico',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de usuários
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id UUID UNIQUE NOT NULL, -- Referência ao auth.users do Supabase
    obs_id UUID REFERENCES obs(id) ON DELETE SET NULL,
    nome VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    telefone VARCHAR(20),
    tipo_usuario tipo_usuario NOT NULL,
    posto_saude VARCHAR(255),
    foto_url TEXT,
    status status_usuario DEFAULT 'ativo',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de eventos de saúde
CREATE TABLE eventos_saude (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obs_id UUID NOT NULL REFERENCES obs(id) ON DELETE CASCADE,
    tipo tipo_evento NOT NULL,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    data_inicio DATE NOT NULL,
    data_fim DATE,
    horario_inicio TIME,
    horario_fim TIME,
    posto_saude VARCHAR(255),
    endereco TEXT,
    profissional_responsavel VARCHAR(255),
    vagas_total INTEGER,
    vagas_ocupadas INTEGER DEFAULT 0,
    publico_alvo TEXT,
    status status_evento DEFAULT 'ativo',
    criado_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de médicos disponíveis
CREATE TABLE medicos_disponiveis (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obs_id UUID NOT NULL REFERENCES obs(id) ON DELETE CASCADE,
    nome VARCHAR(255) NOT NULL,
    crm VARCHAR(20),
    especialidade VARCHAR(255) NOT NULL,
    posto_saude VARCHAR(255) NOT NULL,
    data DATE NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    vagas_total INTEGER NOT NULL DEFAULT 0,
    vagas_ocupadas INTEGER DEFAULT 0,
    status status_evento DEFAULT 'ativo',
    observacoes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de dúvidas da população
CREATE TABLE duvidas_populacao (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obs_id UUID NOT NULL REFERENCES obs(id) ON DELETE CASCADE,
    nome_pessoa VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    numero_whatsapp VARCHAR(20),
    categoria categoria_duvida,
    pergunta TEXT NOT NULL,
    resposta TEXT,
    status status_duvida DEFAULT 'pendente',
    respondido_por UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    data_pergunta TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    data_resposta TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela de auditoria
CREATE TABLE log_auditoria (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    obs_id UUID REFERENCES obs(id) ON DELETE SET NULL,
    usuario_id UUID REFERENCES usuarios(id) ON DELETE SET NULL,
    acao VARCHAR(50) NOT NULL,
    tabela VARCHAR(50) NOT NULL,
    registro_id UUID,
    dados_anteriores JSONB,
    dados_novos JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX idx_usuarios_auth_id ON usuarios(auth_id);
CREATE INDEX idx_usuarios_obs_id ON usuarios(obs_id);
CREATE INDEX idx_eventos_obs_id ON eventos_saude(obs_id);
CREATE INDEX idx_eventos_data_inicio ON eventos_saude(data_inicio);
CREATE INDEX idx_medicos_obs_id ON medicos_disponiveis(obs_id);
CREATE INDEX idx_medicos_data ON medicos_disponiveis(data);
CREATE INDEX idx_duvidas_obs_id ON duvidas_populacao(obs_id);
CREATE INDEX idx_duvidas_status ON duvidas_populacao(status);
CREATE INDEX idx_auditoria_obs_id ON log_auditoria(obs_id);
CREATE INDEX idx_auditoria_usuario_id ON log_auditoria(usuario_id);

-- Triggers para updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_obs_updated_at BEFORE UPDATE ON obs FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_usuarios_updated_at BEFORE UPDATE ON usuarios FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_eventos_updated_at BEFORE UPDATE ON eventos_saude FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_medicos_updated_at BEFORE UPDATE ON medicos_disponiveis FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();