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

-- 3. Inserir registro na tabela public.usuarios
INSERT INTO public.usuarios (
    auth_id,
    nome,
    email,
    tipo_usuario,
    status,
    created_at,
    updated_at
)
VALUES (
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- Mesmo UUID do auth.users
    'Super Administrador',
    'superadmin@multiobs.com',
    'superadmin',
    'ativo',
    now(),
    now()
)
ON CONFLICT (auth_id) DO UPDATE SET
    nome = EXCLUDED.nome,
    email = EXCLUDED.email,
    tipo_usuario = EXCLUDED.tipo_usuario,
    status = EXCLUDED.status,
    updated_at = now();

-- Verificar se o usuário foi criado corretamente
SELECT 
    u.email,
    u.created_at,
    usuarios.nome,
    usuarios.tipo_usuario,
    usuarios.status
FROM auth.users u
LEFT JOIN public.usuarios ON usuarios.auth_id = u.id
WHERE u.email = 'superadmin@multiobs.com';