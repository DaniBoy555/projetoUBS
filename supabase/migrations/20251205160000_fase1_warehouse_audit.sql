-- Criar schema warehouse
create schema if not exists warehouse;

-- Conceder uso no warehouse para usuários autenticados (ajustar conforme necessário)
grant usage on schema warehouse to authenticated;
grant usage on schema warehouse to service_role;

-- Tabelas do Warehouse (Dados Consolidados)
create table if not exists warehouse.consolidado_pec (
    id uuid primary key default gen_random_uuid(),
    data_consolidacao timestamp with time zone default now(),
    origem_dado jsonb, -- Mapeia a origem (qual arquivo/extracao)
    conteudo jsonb -- Dado bruto ou processado
);

create table if not exists warehouse.consolidado_cds (
    id uuid primary key default gen_random_uuid(),
    data_consolidacao timestamp with time zone default now(),
    origem_dado jsonb,
    conteudo jsonb
);

-- Tabela de Logs de Auditoria
create table if not exists public.audit_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id),
    action text not null, -- ex: 'LOGIN', 'CRIAR_OBS', 'EXPORTAR_RELATORIO'
    resource text not null, -- ex: 'auth', 'obs', 'reports'
    details jsonb, -- Metadados do evento
    ip_address text,
    user_agent text,
    created_at timestamp with time zone default now()
);

-- Habilitar RLS em audit_logs
alter table public.audit_logs enable row level security;

-- Política: Usuários podem inserir apenas seus próprios logs (ou logs do sistema via função)
-- Por enquanto, permitir que autenticados insiram.
create policy "Usuarios podem inserir logs de auditoria"
    on public.audit_logs
    for insert
    to authenticated
    with check (true);

-- Política: Apenas Admins podem ver logs de auditoria
-- Assumindo verificação de role 'superadmin' via tabela public.usuarios ou mecanismo similar
-- Por simplicidade nesta fase inicial, permitimos leitura se o usuário for superadmin em public.usuarios
create policy "Admins podem ver logs de auditoria"
    on public.audit_logs
    for select
    to authenticated
    using (
        exists (
            select 1 from public.usuarios
            where usuarios.id = auth.uid()
            and usuarios.role = 'superadmin'
        )
    );
