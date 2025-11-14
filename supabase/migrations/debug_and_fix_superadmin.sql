-- ==========================================
-- SCRIPT DE DIAGNÓSTICO E CORREÇÃO DO SUPERADMIN
-- Execute este script no SQL Editor do Supabase Studio
-- ==========================================

-- 1. DIAGNÓSTICO: Verificar estado atual do usuário SuperAdmin
SELECT '=== DIAGNÓSTICO INICIAL ===' as info;

-- Verificar se existe na tabela auth.users
SELECT 
    'AUTH.USERS' as tabela,
    u.id,
    u.email,
    u.created_at,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    u.role
FROM auth.users u 
WHERE u.email = 'superadmin@multiobs.com';

-- Verificar se existe na tabela public.usuarios
SELECT 
    'PUBLIC.USUARIOS' as tabela,
    usuarios.id,
    usuarios.auth_id,
    usuarios.nome,
    usuarios.email,
    usuarios.tipo_usuario,
    usuarios.status,
    usuarios.created_at
FROM public.usuarios 
WHERE usuarios.email = 'superadmin@multiobs.com';

-- Verificar se existe auth_id órfão (auth.users sem public.usuarios)
SELECT 
    'AUTH ÓRFÃO' as status,
    u.id as auth_id,
    u.email,
    CASE 
        WHEN usuarios.auth_id IS NULL THEN 'SEM REGISTRO EM USUARIOS'
        ELSE 'COM REGISTRO EM USUARIOS'
    END as situacao
FROM auth.users u
LEFT JOIN public.usuarios ON usuarios.auth_id = u.id
WHERE u.email = 'superadmin@multiobs.com';

-- ==========================================
-- 2. CORREÇÃO: Criar/Atualizar usuário SuperAdmin
-- ==========================================

-- Inserir/Atualizar na tabela auth.users
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
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
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
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = EXCLUDED.email_confirmed_at,
    updated_at = now(),
    role = EXCLUDED.role,
    aud = EXCLUDED.aud;

-- Inserir/Atualizar identidade
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
)
ON CONFLICT (id) DO UPDATE SET
    identity_data = EXCLUDED.identity_data,
    updated_at = now();

-- Inserir/Atualizar na tabela public.usuarios
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
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11',
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

-- ==========================================
-- 3. VERIFICAÇÃO FINAL
-- ==========================================

SELECT '=== VERIFICAÇÃO FINAL ===' as info;

-- Verificar se tudo foi criado corretamente
SELECT 
    'RESULTADO FINAL' as status,
    u.id as auth_id,
    u.email as auth_email,
    u.email_confirmed_at IS NOT NULL as email_confirmado,
    usuarios.id as user_id,
    usuarios.nome,
    usuarios.tipo_usuario,
    usuarios.status,
    CASE 
        WHEN u.id IS NOT NULL AND usuarios.auth_id IS NOT NULL THEN '✅ COMPLETO'
        WHEN u.id IS NOT NULL AND usuarios.auth_id IS NULL THEN '⚠️ SÓ NO AUTH'
        WHEN u.id IS NULL AND usuarios.auth_id IS NOT NULL THEN '⚠️ SÓ NO USUARIOS'
        ELSE '❌ NÃO ENCONTRADO'
    END as situacao
FROM auth.users u
FULL OUTER JOIN public.usuarios ON usuarios.auth_id = u.id
WHERE u.email = 'superadmin@multiobs.com' 
   OR usuarios.email = 'superadmin@multiobs.com';

-- Listar todos os usuários para debug
SELECT 
    '=== TODOS OS USUÁRIOS ===' as info,
    usuarios.auth_id,
    usuarios.nome,
    usuarios.email,
    usuarios.tipo_usuario,
    usuarios.status
FROM public.usuarios
ORDER BY usuarios.created_at DESC
LIMIT 5;