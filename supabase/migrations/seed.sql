-- Inserir OBS de exemplo
INSERT INTO obs (id, nome, cidade, estado, cnpj, telefone, email, status, plano)
VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'OBS Central São Paulo',
    'São Paulo',
    'SP',
    '12.345.678/0001-90',
    '(11) 3333-4444',
    'contato@obssp.gov.br',
    'ativo',
    'premium'
);

-- Inserir usuário SuperAdmin de teste
-- Primeiro, vamos criar um auth user fictício
-- O auth_id será usado para referenciar o usuário de autenticação
INSERT INTO usuarios (
    id,
    auth_id,
    obs_id,
    nome,
    email,
    telefone,
    tipo_usuario,
    posto_saude,
    status
) VALUES (
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- auth_id fictício
    NULL, -- SuperAdmin não está vinculado a uma OBS específica
    'Super Administrador',
    'superadmin@multiobs.com',
    '(11) 99999-0000',
    'superadmin',
    NULL,
    'ativo'
);

-- Inserir alguns eventos de exemplo
INSERT INTO eventos_saude (
    obs_id,
    tipo,
    titulo,
    descricao,
    data_inicio,
    data_fim,
    horario_inicio,
    horario_fim,
    posto_saude,
    endereco,
    profissional_responsavel,
    vagas_total,
    vagas_ocupadas,
    publico_alvo,
    criado_por
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'vacina',
    'Campanha de Vacinação contra Gripe',
    'Campanha anual de vacinação contra influenza para toda a população',
    '2025-03-01',
    '2025-03-31',
    '08:00:00',
    '17:00:00',
    'UBS Central',
    'Rua das Flores, 123 - Centro',
    'Dr. João Silva',
    500,
    0,
    'Toda a população acima de 6 meses',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'
);

-- Inserir médicos disponíveis de exemplo
INSERT INTO medicos_disponiveis (
    obs_id,
    nome,
    crm,
    especialidade,
    posto_saude,
    data,
    horario_inicio,
    horario_fim,
    vagas_total,
    vagas_ocupadas
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Dra. Maria Santos',
    'CRM-SP 123456',
    'Clínica Geral',
    'UBS Central',
    '2025-01-15',
    '08:00:00',
    '12:00:00',
    16,
    0
);

-- Inserir algumas dúvidas de exemplo
INSERT INTO duvidas_populacao (
    obs_id,
    nome_pessoa,
    email,
    numero_whatsapp,
    categoria,
    pergunta,
    status
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'Ana Oliveira',
    'ana@email.com',
    '11999887766',
    'vacina',
    'Gostaria de saber quando estará disponível a vacina contra COVID-19 para crianças de 2 anos.',
    'pendente'
);

-- Log de auditoria de exemplo
INSERT INTO log_auditoria (
    obs_id,
    usuario_id,
    acao,
    tabela,
    registro_id,
    dados_novos
) VALUES (
    'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'INSERT',
    'usuarios',
    'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"nome": "Super Administrador", "email": "superadmin@multiobs.com", "tipo_usuario": "superadmin"}'::jsonb
);