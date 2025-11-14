-- Script para verificar e criar o usuário superadmin caso não exista
-- Execute este no SQL Editor do Supabase Studio

-- Primeiro, vamos verificar se o usuário já existe
SELECT 
    'Usuário auth existente:' as status,
    id, 
    email, 
    created_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'superadmin@multiobs.com';

-- Se não existir, vamos criar
-- IMPORTANTE: Execute apenas se a consulta acima retornar vazio

-- Criar UUID consistente
DO $$ 
DECLARE
    user_uuid uuid := 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11';
    existing_user_count integer;
BEGIN
    -- Verificar se usuário já existe
    SELECT COUNT(*) INTO existing_user_count 
    FROM auth.users 
    WHERE email = 'superadmin@multiobs.com';
    
    IF existing_user_count = 0 THEN
        -- Criar usuário na auth.users
        INSERT INTO auth.users (
            id,
            instance_id,
            email,
            encrypted_password,
            email_confirmed_at,
            created_at,
            updated_at,
            role,
            aud
        ) VALUES (
            user_uuid,
            '00000000-0000-0000-0000-000000000000',
            'superadmin@multiobs.com',
            crypt('123456', gen_salt('bf')),
            NOW(),
            NOW(),
            NOW(),
            'authenticated',
            'authenticated'
        );

        -- Criar identidade
        INSERT INTO auth.identities (
            id,
            user_id,
            provider_id,
            identity_data,
            provider,
            created_at,
            updated_at
        ) VALUES (
            user_uuid,
            user_uuid,
            user_uuid,
            json_build_object(
                'sub', user_uuid,
                'email', 'superadmin@multiobs.com'
            ),
            'email',
            NOW(),
            NOW()
        );

        RAISE NOTICE 'Usuário superadmin criado com sucesso!';
    ELSE
        RAISE NOTICE 'Usuário superadmin já existe!';
    END IF;
END $$;

-- Verificar o resultado final
SELECT 
    'Resultado final:' as status,
    u.id,
    u.email,
    u.created_at,
    u.email_confirmed_at,
    usuarios.nome,
    usuarios.tipo_usuario
FROM auth.users u
LEFT JOIN public.usuarios ON usuarios.auth_id = u.id
WHERE u.email = 'superadmin@multiobs.com';