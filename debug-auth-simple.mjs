// Script de debug simplificado para testar autenticação
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tunghnlotxnslbsuawpc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1bmdobmxvdHhuc2xic3Vhd3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODE1MDYsImV4cCI6MjA3ODU1NzUwNn0.r3JnLDKb2bZXoKqDEE_Pw-VfXwB1w7WDgY7g2W_NsTY';

console.log('🔍 Debug de Autenticação Multi-OBS');
console.log('Iniciando testes...\n');

const supabase = createClient(supabaseUrl, supabaseKey);

try {
  console.log('1. 🧪 Testando conexão...');
  
  // Teste básico de conexão
  const { data: obsCount, error: obsError } = await supabase
    .from('obs')
    .select('id')
    .limit(1);
  
  if (obsError) {
    console.error('❌ Erro de conexão:', obsError.message);
  } else {
    console.log('✅ Conexão com banco OK');
  }

  console.log('\n2. 🔐 Testando login...');
  
  // Teste de login
  const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
    email: 'superadmin@multiobs.com',
    password: '123456'
  });

  if (loginError) {
    console.error('❌ Erro de login:', loginError.message);
    console.log('Código do erro:', loginError.status);
    
    // Se o erro for de usuário não encontrado, vamos verificar
    if (loginError.message.includes('Invalid login credentials')) {
      console.log('\n3. 🔍 Verificando se usuário existe na auth.users...');
      // Como não podemos acessar auth.users diretamente, vamos verificar se conseguimos criar
      console.log('💡 Sugestão: Execute o script create_superadmin.sql no Supabase Studio');
    }
  } else {
    console.log('✅ Login bem-sucedido!');
    console.log('User ID:', loginData.user?.id);
    
    // Tentar buscar dados do usuário
    const { data: userData, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('auth_id', loginData.user?.id);
      
    if (userError) {
      console.error('❌ Erro ao buscar usuário:', userError.message);
    } else {
      console.log('✅ Dados do usuário:', userData[0]);
    }
  }

} catch (error) {
  console.error('❌ Erro geral:', error.message);
}

console.log('\n🏁 Debug finalizado');