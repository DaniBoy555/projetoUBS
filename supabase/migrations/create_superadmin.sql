-- Script para criar usuário SuperAdmin no Supabase Auth
-- Execute este script no SQL Editor do Supabase Studio

-- 1. Inserir usuário na tabela auth.users
INSERT INTO auth.users (
    id,
    instance_id,
    email,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    role,
    aud,
    confirmation_token,
    recovery_token,
    email_change_token_new,
    email_change
)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- UUID específico que usamos no seed
    '00000000-0000-0000-0000-000000000000',
    'superadmin@multiobs.com',
    crypt('123456', gen_salt('bf')), -- Senha: 123456
    now(),
    now(),
    now(),
    'authenticated',
    'authenticated',
    '',
    '',
    '',
    ''
);

-- 2. Inserir identidade do usuário
INSERT INTO auth.identities (
    id,
    user_id,
    provider_id,
    identity_data,
    provider,
    created_at,
    updated_at
)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
    '{"sub": "c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11", "email": "superadmin@multiobs.com"}',
    'email',
    now(),
    now()
);

-- Verificar se o usuário foi criado corretamente
SELECT 
    u.email,
    u.created_at,
    usuarios.nome,
    usuarios.tipo_usuario
FROM auth.users u
LEFT JOIN public.usuarios ON usuarios.auth_id = u.id
WHERE u.email = 'superadmin@multiobs.com';