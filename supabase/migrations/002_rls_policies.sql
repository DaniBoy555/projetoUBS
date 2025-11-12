-- Habilitar RLS em todas as tabelas
ALTER TABLE obs ENABLE ROW LEVEL SECURITY;
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE eventos_saude ENABLE ROW LEVEL SECURITY;
ALTER TABLE medicos_disponiveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE duvidas_populacao ENABLE ROW LEVEL SECURITY;
ALTER TABLE log_auditoria ENABLE ROW LEVEL SECURITY;

-- Função auxiliar para obter o usuário atual
CREATE OR REPLACE FUNCTION get_current_user_id()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_id UUID;
BEGIN
    SELECT id INTO user_id
    FROM usuarios
    WHERE auth_id = auth.uid();
    
    RETURN user_id;
END;
$$;

-- Função auxiliar para obter o tipo de usuário atual
CREATE OR REPLACE FUNCTION get_current_user_type()
RETURNS tipo_usuario
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_type tipo_usuario;
BEGIN
    SELECT tipo_usuario INTO user_type
    FROM usuarios
    WHERE auth_id = auth.uid();
    
    RETURN user_type;
END;
$$;

-- Função auxiliar para obter a OBS do usuário atual
CREATE OR REPLACE FUNCTION get_current_user_obs()
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    obs_id UUID;
BEGIN
    SELECT u.obs_id INTO obs_id
    FROM usuarios u
    WHERE u.auth_id = auth.uid();
    
    RETURN obs_id;
END;
$$;

-- Políticas para tabela OBS
CREATE POLICY "SuperAdmin pode ver todas as OBS" ON obs
    FOR SELECT USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Admin OBS pode ver sua própria OBS" ON obs
    FOR SELECT USING (
        get_current_user_type() = 'admin_obs' 
        AND id = get_current_user_obs()
    );

CREATE POLICY "SuperAdmin pode inserir OBS" ON obs
    FOR INSERT WITH CHECK (get_current_user_type() = 'superadmin');

CREATE POLICY "SuperAdmin pode atualizar OBS" ON obs
    FOR UPDATE USING (get_current_user_type() = 'superadmin');

-- Políticas para tabela usuarios
CREATE POLICY "SuperAdmin pode ver todos os usuários" ON usuarios
    FOR SELECT USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Admin OBS pode ver usuários da sua OBS" ON usuarios
    FOR SELECT USING (
        get_current_user_type() = 'admin_obs' 
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "Usuários podem ver seu próprio perfil" ON usuarios
    FOR SELECT USING (auth_id = auth.uid());

CREATE POLICY "SuperAdmin pode inserir usuários" ON usuarios
    FOR INSERT WITH CHECK (get_current_user_type() = 'superadmin');

CREATE POLICY "Admin OBS pode inserir usuários na sua OBS" ON usuarios
    FOR INSERT WITH CHECK (
        get_current_user_type() = 'admin_obs' 
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "SuperAdmin pode atualizar usuários" ON usuarios
    FOR UPDATE USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Admin OBS pode atualizar usuários da sua OBS" ON usuarios
    FOR UPDATE USING (
        get_current_user_type() = 'admin_obs' 
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "Usuários podem atualizar seu próprio perfil" ON usuarios
    FOR UPDATE USING (auth_id = auth.uid());

-- Políticas para eventos_saude
CREATE POLICY "SuperAdmin pode ver todos os eventos" ON eventos_saude
    FOR SELECT USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Usuários podem ver eventos da sua OBS" ON eventos_saude
    FOR SELECT USING (obs_id = get_current_user_obs());

CREATE POLICY "População pode ver eventos públicos" ON eventos_saude
    FOR SELECT USING (get_current_user_type() = 'populacao');

CREATE POLICY "Admin OBS pode inserir eventos" ON eventos_saude
    FOR INSERT WITH CHECK (
        get_current_user_type() IN ('admin_obs', 'agente_saude')
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "Admin OBS pode atualizar eventos da sua OBS" ON eventos_saude
    FOR UPDATE USING (
        get_current_user_type() IN ('admin_obs', 'agente_saude')
        AND obs_id = get_current_user_obs()
    );

-- Políticas para medicos_disponiveis
CREATE POLICY "SuperAdmin pode ver todos os médicos" ON medicos_disponiveis
    FOR SELECT USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Usuários podem ver médicos da sua OBS" ON medicos_disponiveis
    FOR SELECT USING (obs_id = get_current_user_obs());

CREATE POLICY "População pode ver médicos disponíveis" ON medicos_disponiveis
    FOR SELECT USING (get_current_user_type() = 'populacao');

CREATE POLICY "Admin OBS pode inserir médicos" ON medicos_disponiveis
    FOR INSERT WITH CHECK (
        get_current_user_type() IN ('admin_obs', 'agente_saude')
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "Admin OBS pode atualizar médicos da sua OBS" ON medicos_disponiveis
    FOR UPDATE USING (
        get_current_user_type() IN ('admin_obs', 'agente_saude')
        AND obs_id = get_current_user_obs()
    );

-- Políticas para duvidas_populacao
CREATE POLICY "SuperAdmin pode ver todas as dúvidas" ON duvidas_populacao
    FOR SELECT USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Admin OBS pode ver dúvidas da sua OBS" ON duvidas_populacao
    FOR SELECT USING (
        get_current_user_type() IN ('admin_obs', 'agente_saude')
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "Qualquer um pode inserir dúvidas" ON duvidas_populacao
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin OBS pode atualizar dúvidas da sua OBS" ON duvidas_populacao
    FOR UPDATE USING (
        get_current_user_type() IN ('admin_obs', 'agente_saude')
        AND obs_id = get_current_user_obs()
    );

-- Políticas para log_auditoria
CREATE POLICY "SuperAdmin pode ver todos os logs" ON log_auditoria
    FOR SELECT USING (get_current_user_type() = 'superadmin');

CREATE POLICY "Admin OBS pode ver logs da sua OBS" ON log_auditoria
    FOR SELECT USING (
        get_current_user_type() = 'admin_obs'
        AND obs_id = get_current_user_obs()
    );

CREATE POLICY "Sistema pode inserir logs" ON log_auditoria
    FOR INSERT WITH CHECK (true);

-- Permitir que o sistema autônomo (service role) acesse tudo
CREATE POLICY "Service role tem acesso total" ON obs FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role tem acesso total usuarios" ON usuarios FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role tem acesso total eventos" ON eventos_saude FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role tem acesso total medicos" ON medicos_disponiveis FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role tem acesso total duvidas" ON duvidas_populacao FOR ALL USING (current_setting('role') = 'service_role');
CREATE POLICY "Service role tem acesso total logs" ON log_auditoria FOR ALL USING (current_setting('role') = 'service_role');