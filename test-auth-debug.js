// Script de debug para testar autenticação
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tunghnlotxnslbsuawpc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1bmdobmxvdHhuc2xic3Vhd3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODE1MDYsImV4cCI6MjA3ODU1NzUwNn0.r3JnLDKb2bZXoKqDEE_Pw-VfXwB1w7WDgY7g2W_NsTY';

console.log('🔍 Debug de Autenticação Multi-OBS');
console.log('URL:', supabaseUrl);
console.log('Key (20 chars):', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function debugAuth() {
  try {
    console.log('\n1. 🧪 Testando conexão básica...');
    
    // Teste 1: Verificar se consegue acessar a API
    const { data: healthCheck, error: healthError } = await supabase
      .from('obs')
      .select('count')
      .limit(1);
    
    if (healthError) {
      console.error('❌ Erro de conexão:', healthError.message);
      return;
    }
    console.log('✅ Conexão com banco OK');

    console.log('\n2. 🔐 Testando login com superadmin...');
    
    // Teste 2: Login
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email: 'superadmin@multiobs.com',
      password: '123456'
    });

    if (loginError) {
      console.error('❌ Erro de login:', loginError.message);
      console.log('Possíveis causas:');
      console.log('  1. Usuário não existe na tabela auth.users');
      console.log('  2. Senha incorreta');
      console.log('  3. Email não confirmado');
      
      console.log('\n3. 🔍 Verificando se usuário existe...');
      // Tentar verificar se o usuário existe (isso pode falhar por RLS)
      const { data: userCheck, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', 'superadmin@multiobs.com');
        
      if (userError) {
        console.log('⚠️ Não foi possível verificar usuário (normal):', userError.message);
      } else {
        console.log('👤 Usuário na tabela usuarios:', userCheck);
      }
      
      return;
    }

    console.log('✅ Login bem-sucedido!');
    console.log('👤 User ID:', loginData.user?.id);
    console.log('📧 Email:', loginData.user?.email);

    console.log('\n3. 👥 Verificando dados na tabela usuarios...');
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_id', loginData.user?.id)
      .single();

    if (userError) {
      console.error('❌ Erro ao buscar dados do usuário:', userError.message);
      console.log('Isso significa que o usuário não está na tabela usuarios');
      return;
    }

    console.log('✅ Dados do usuário encontrados:');
    console.log('   Nome:', userData.nome);
    console.log('   Tipo:', userData.tipo_usuario);
    console.log('   Status:', userData.status);

    console.log('\n🎉 Tudo funcionando! O problema pode estar no frontend.');
    
  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

debugAuth();