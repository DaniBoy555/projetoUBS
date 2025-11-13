// Teste de conexão com Supabase
// Execute: npm run dev e acesse /test-supabase

import { supabase } from './supabase';

export async function testSupabaseConnection() {
  console.log('🔄 Testando conexão com Supabase...');
  
  try {
    // 1. Testar conexão básica
    const { data: testData, error: testError } = await supabase
      .from('obs')
      .select('count')
      .limit(1);
    
    if (testError) {
      throw new Error(`Erro de conexão: ${testError.message}`);
    }
    
    console.log('✅ Conexão com Supabase OK!');
    
    // 2. Testar se tabelas existem
    const { data: obsData, error: obsError } = await supabase
      .from('obs')
      .select('id, nome, cidade, status')
      .limit(3);
    
    if (obsError) {
      throw new Error(`Erro ao buscar OBS: ${obsError.message}`);
    }
    
    console.log('✅ Tabelas criadas com sucesso!');
    console.log('📊 OBS encontradas:', obsData);
    
    // 3. Testar inserção de usuário teste
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('id, nome, tipo_usuario')
      .limit(1);
    
    if (userError) {
      console.log('⚠️ Tabela usuarios existe mas pode estar vazia');
    } else {
      console.log('👥 Usuários encontrados:', userData);
    }
    
    return {
      success: true,
      message: 'Supabase configurado com sucesso!',
      obs: obsData,
      users: userData
    };
    
  } catch (error: any) {
    console.error('❌ Erro ao conectar com Supabase:', error.message);
    return {
      success: false,
      error: error.message
    };
  }
}

// Função para criar usuário SuperAdmin inicial
export async function createSuperAdmin(email: string, password: string, nome: string) {
  try {
    console.log('🔄 Criando SuperAdmin inicial...');
    
    // 1. Criar usuário na autenticação
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (authError) throw authError;
    if (!authData.user) throw new Error('Erro ao criar usuário');
    
    // 2. Criar registro na tabela usuarios
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .insert({
        auth_id: authData.user.id,
        obs_id: null, // SuperAdmin não tem OBS
        nome,
        email,
        tipo_usuario: 'superadmin',
        status: 'ativo'
      })
      .select()
      .single();
    
    if (userError) throw userError;
    
    console.log('✅ SuperAdmin criado com sucesso!', userData);
    return { success: true, user: userData };
    
  } catch (error: any) {
    console.error('❌ Erro ao criar SuperAdmin:', error.message);
    return { success: false, error: error.message };
  }
}