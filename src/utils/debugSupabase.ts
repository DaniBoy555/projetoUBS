import { supabase } from '@/lib/supabase';

export const debugSupabase = {
  // Test basic Supabase connection
  async testConnection() {
    try {
      console.log('🔍 Testando conexão básica com Supabase...');
      const { data, error } = await supabase.from('usuarios').select('count').limit(1);
      
      if (error) {
        console.error('❌ Erro na conexão:', error);
        return { success: false, error };
      }
      
      console.log('✅ Conexão com Supabase OK');
      return { success: true, data };
    } catch (error) {
      console.error('💥 Erro crítico na conexão:', error);
      return { success: false, error };
    }
  },

  // Check if superadmin user exists in usuarios table
  async checkSuperadminUser() {
    try {
      console.log('🔍 Verificando usuário SuperAdmin...');
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', 'superadmin@multiobs.com')
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar SuperAdmin:', error);
        return { exists: false, error };
      }

      if (!data) {
        console.warn('⚠️ SuperAdmin não encontrado na tabela usuarios');
        return { exists: false, data: null };
      }

      console.log('✅ SuperAdmin encontrado:', data);
      return { exists: true, data };
    } catch (error) {
      console.error('💥 Erro ao verificar SuperAdmin:', error);
      return { exists: false, error };
    }
  },

  // Check user by auth_id
  async checkUserByAuthId(authId: string) {
    try {
      console.log(`🔍 Buscando usuário por auth_id: ${authId}`);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao buscar usuário por auth_id:', error);
        return { found: false, error };
      }

      if (!data) {
        console.warn('⚠️ Usuário não encontrado por auth_id');
        return { found: false, data: null };
      }

      console.log('✅ Usuário encontrado por auth_id:', data);
      return { found: true, data };
    } catch (error) {
      console.error('💥 Erro ao buscar por auth_id:', error);
      return { found: false, error };
    }
  },

  // List all users in the table
  async listAllUsers() {
    try {
      console.log('📋 Listando todos os usuários...');
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('id, auth_id, nome, email, tipo_usuario, status')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) {
        console.error('❌ Erro ao listar usuários:', error);
        return { success: false, error };
      }

      console.log(`📊 ${data?.length || 0} usuários encontrados:`, data);
      return { success: true, data };
    } catch (error) {
      console.error('💥 Erro ao listar usuários:', error);
      return { success: false, error };
    }
  },

  // Test authentication with known credentials
  async testAuth(email = 'superadmin@multiobs.com', password = '123456') {
    try {
      console.log('🔑 Testando autenticação...');
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('❌ Erro na autenticação:', error);
        return { success: false, error };
      }

      if (data.user) {
        console.log('✅ Autenticação bem-sucedida:', {
          id: data.user.id,
          email: data.user.email,
          created_at: data.user.created_at
        });

        // Imediatamente sair para não afetar o estado atual
        await supabase.auth.signOut();
        
        return { success: true, user: data.user };
      }

      return { success: false, error: 'Nenhum usuário retornado' };
    } catch (error) {
      console.error('💥 Erro no teste de autenticação:', error);
      return { success: false, error };
    }
  },

  // Run comprehensive diagnosis
  async runFullDiagnosis() {
    console.log('🩺 Iniciando diagnóstico completo do Supabase...');
    console.log('═'.repeat(60));

    const results = {
      connection: await this.testConnection(),
      superadminUser: await this.checkSuperadminUser(),
      allUsers: await this.listAllUsers(),
      auth: await this.testAuth()
    };

    console.log('📊 Resumo do diagnóstico:');
    console.log('- Conexão:', results.connection.success ? '✅ OK' : '❌ FALHA');
    console.log('- SuperAdmin na tabela:', results.superadminUser.exists ? '✅ OK' : '❌ FALHA');
    console.log('- Usuários na tabela:', results.allUsers.data?.length || 0);
    console.log('- Autenticação:', results.auth.success ? '✅ OK' : '❌ FALHA');
    console.log('═'.repeat(60));

    return results;
  }
};

// Make it available globally for debugging
(window as any).debugSupabase = debugSupabase;