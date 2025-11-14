# 🔧 Como Corrigir o Problema de Login

## 🚨 Problema Identificado:
- O usuário consegue autenticar no Supabase Auth
- Mas não encontra registro na tabela `public.usuarios`
- Por isso o login falha e cai no modo demo

## ✅ Solução: Execute este SQL no Supabase

### 1. Abrir Supabase Studio
1. Vá para [https://supabase.com](https://supabase.com)
2. Entre no projeto `tunghnlotxnslbsuawpc`
3. Clique em **SQL Editor** no menu lateral

### 2. Execute este SQL:

```sql
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
```

### 3. Verificar se funcionou:

```sql
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
```

## 🔑 Credenciais para Login:

Após executar o SQL acima, use:
- **Email:** `superadmin@multiobs.com`
- **Senha:** `123456`

## ✅ Resultado Esperado:
- Login direto sem modo demo
- Redirecionamento para `/superadmin`
- Usuário logado como "Super Administrador"

---

**📁 Arquivo também disponível em:** `supabase/migrations/fix_superadmin.sql`