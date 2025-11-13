// Teste de conexão com Supabase
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Carregar variáveis de ambiente
dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://tunghnlotxnslbsuawpc.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR1bmdobmxvdHhuc2xic3Vhd3BjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5ODE1MDYsImV4cCI6MjA3ODU1NzUwNn0.r3JnLDKb2bZXoKqDEE_Pw-VfXwB1w7WDgY7g2W_NsTY';

console.log('🔍 Testando conexão com Supabase...');
console.log('URL:', supabaseUrl);
console.log('Key (primeiros 20 chars):', supabaseKey.substring(0, 20) + '...');

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    // Teste 1: Verificar tabelas
    console.log('\n📋 Teste 1: Listando tabelas...');
    const { data: tables, error: tablesError } = await supabase
      .from('obs')
      .select('*')
      .limit(1);
    
    if (tablesError) {
      console.error('❌ Erro ao acessar tabela obs:', tablesError.message);
    } else {
      console.log('✅ Tabela obs acessível:', tables);
    }

    // Teste 2: Verificar auth
    console.log('\n🔐 Teste 2: Testando autenticação...');
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: 'superadmin@multiobs.com',
      password: '123456'
    });

    if (authError) {
      console.error('❌ Erro de autenticação:', authError.message);
    } else {
      console.log('✅ Login realizado com sucesso!');
      console.log('User ID:', authData.user?.id);
      console.log('Email:', authData.user?.email);

      // Teste 3: Verificar usuário na tabela usuarios
      console.log('\n👤 Teste 3: Verificando usuário na tabela usuarios...');
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authData.user?.id)
        .single();

      if (userError) {
        console.error('❌ Erro ao buscar usuário:', userError.message);
      } else {
        console.log('✅ Usuário encontrado:', userData);
      }
    }

  } catch (error) {
    console.error('❌ Erro geral:', error);
  }
}

testConnection();