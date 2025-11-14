-- Script para corrigir o SuperAdmin existente
-- Execute este script no SQL Editor do Supabase Studio para corrigir o problema

-- Inserir registro na tabela public.usuarios para o SuperAdmin existente
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
    'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', -- UUID do auth existente
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

-- Verificar se foi corrigido
SELECT 
    u.email as "Email Auth",
    u.created_at as "Criado em Auth",
    usuarios.nome as "Nome Usuário",
    usuarios.tipo_usuario as "Tipo",
    usuarios.status as "Status"
FROM auth.users u
LEFT JOIN public.usuarios ON usuarios.auth_id = u.id
WHERE u.email = 'superadmin@multiobs.com';