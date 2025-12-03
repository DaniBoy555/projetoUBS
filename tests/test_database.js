// Test script to verify Supabase connection and superadmin user
// Run with: node test_database.js

import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('🔍 Testando configuração do Supabase...');
console.log('URL:', supabaseUrl?.substring(0, 30) + '...');
console.log('Key:', supabaseKey?.substring(0, 20) + '...');

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Variáveis de ambiente não configuradas!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function runTests() {
  console.log('\n🧪 Executando testes...\n');

  try {
    // Teste 1: Conexão básica
    console.log('1️⃣ Testando conexão básica...');
    const { data: connectionTest, error: connectionError } = await supabase
      .from('usuarios')
      .select('count')
      .limit(1);
    
    if (connectionError) {
      console.error('❌ Erro na conexão:', connectionError);
      return;
    }
    console.log('✅ Conexão OK');

    // Teste 2: Verificar usuários na tabela
    console.log('\n2️⃣ Listando usuários na tabela...');
    const { data: users, error: usersError } = await supabase
      .from('usuarios')
      .select('auth_id, nome, email, tipo_usuario, status');
    
    if (usersError) {
      console.error('❌ Erro ao buscar usuários:', usersError);
      console.error('Detalhes do erro:', usersError);
      if (usersError.message?.includes('permission denied') || usersError.code === 'PGRST301') {
        console.log('💡 Possível problema de RLS (Row Level Security)');
        console.log('💡 As políticas podem estar bloqueando o acesso à tabela');
      }
      return;
    }
    
    console.log(`📊 ${users.length} usuários encontrados:`);
    users.forEach((user, index) => {
      console.log(`  ${index + 1}. ${user.nome} (${user.email}) - ${user.tipo_usuario}`);
      console.log(`     auth_id: ${user.auth_id}`);
    });

    // Teste 3: Buscar SuperAdmin específico
    console.log('\n3️⃣ Verificando SuperAdmin...');
    const { data: superadmin, error: superadminError } = await supabase
      .from('usuarios')
      .select('*')
      .eq('email', 'superadmin@multiobs.com')
      .maybeSingle();

    if (superadminError) {
      console.error('❌ Erro ao buscar SuperAdmin:', superadminError);
      return;
    }

    if (!superadmin) {
      console.error('❌ SuperAdmin não encontrado na tabela usuarios!');
      console.log('💡 Execute o script SQL debug_and_fix_superadmin.sql no Supabase Studio');
      return;
    }

    console.log('✅ SuperAdmin encontrado:');
    console.log(`   Nome: ${superadmin.nome}`);
    console.log(`   Email: ${superadmin.email}`);
    console.log(`   Auth ID: ${superadmin.auth_id}`);
    console.log(`   Tipo: ${superadmin.tipo_usuario}`);
    console.log(`   Status: ${superadmin.status}`);

    // Teste 4: Teste de autenticação
    console.log('\n4️⃣ Testando autenticação...');
    const { data: authResult, error: authError } = await supabase.auth.signInWithPassword({
      email: 'superadmin@multiobs.com',
      password: '123456'
    });

    if (authError) {
      console.error('❌ Erro na autenticação:', authError.message);
      if (authError.message.includes('Invalid login credentials')) {
        console.log('💡 O usuário pode não ter sido criado corretamente na tabela auth.users');
        console.log('💡 Execute o script SQL debug_and_fix_superadmin.sql no Supabase Studio');
      }
      return;
    }

    if (authResult.user) {
      console.log('✅ Autenticação bem-sucedida!');
      console.log(`   Auth ID: ${authResult.user.id}`);
      console.log(`   Email: ${authResult.user.email}`);
      
      // Fazer logout imediatamente
      await supabase.auth.signOut();
      console.log('✅ Logout realizado');
    }

    console.log('\n🎉 Todos os testes passaram! O sistema está funcionando corretamente.');

  } catch (error) {
    console.error('\n💥 Erro inesperado:', error);
  }
}

runTests();