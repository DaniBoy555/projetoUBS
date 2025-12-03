import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, type Usuario } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true; // Prevenir atualizações em componentes desmontados
    
    // Timeout de segurança para evitar loading infinito
    const loadingTimeout = setTimeout(() => {
      if (isMounted && loading) {
        console.log('Timeout de carregamento atingido, definindo loading como false');
        setLoading(false);
      }
    }, 10000); // 10 segundos máximo de loading
    
    // Verificar sessão existente
    checkUser(isMounted);

    if (!isSupabaseConfigured) {
      clearTimeout(loadingTimeout);
      return;
    }

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔄 Estado de autenticação alterado:', event, session?.user?.email);
        if (!isMounted) return;
        
        if (event === 'SIGNED_IN' && session?.user) {
          console.log('👤 Usuário logado, carregando dados...');
          await loadUserData(session.user.id, true, isMounted); // true para redirecionar
        } else if (event === 'SIGNED_OUT') {
          console.log('👋 Usuário deslogado');
          setUser(null);
        }
      }
    );

    return () => {
      isMounted = false;
      clearTimeout(loadingTimeout);
      subscription.unsubscribe();
    };
  }, []);

  const checkUser = async (isMounted = true) => {
    try {
      if (!isSupabaseConfigured) {
        // No modo demonstração, não há usuário logado inicialmente
        if (isMounted) setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user && isMounted) {
        await loadUserData(session.user.id, false, isMounted);
      }
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const loadUserData = async (authId: string, shouldRedirect = false, isMounted = true) => {
    try {
      console.log('📊 Carregando dados do usuário:', authId);
      if (!isMounted) return;

      // Busca dados na tabela 'usuarios'
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) {
        console.error('❌ Erro ao carregar dados do usuário:', error);
        // Em caso de erro crítico, desloga para evitar estado inconsistente
        // Mas se for apenas erro de conexão, mantém a sessão
        throw error;
      }

      if (!data) {
        console.warn('⚠️ Usuário autenticado mas não encontrado na tabela pública.');
        // Aqui poderíamos criar o usuário automaticamente se fosse o caso,
        // ou deslogar. Por enquanto, vamos manter o usuário logado mas sem perfil completo
        // ou redirecionar para uma página de "Complete seu cadastro".
        return;
      }

      // Usuário encontrado na tabela
      console.log('✅ Dados do usuário encontrados:', data);
      if (isMounted) {
        setUser(data);
        if (shouldRedirect) {
          console.log('🚀 Redirecionando usuário real:', data.tipo_usuario);
          setTimeout(() => redirectByUserType(data), 500);
        }
      }

    } catch (error: any) {
      console.error('❌ Erro ao carregar dados do usuário:', error);
      toast.error('Erro ao carregar perfil do usuário.');
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        toast.error('Supabase não configurado. Verifique o arquivo .env');
        return;
      }

      console.log('🔐 Tentando autenticação com Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro Supabase:', error);
        
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Credenciais inválidas. Verifique email e senha.');
          return;
        }
        
        throw error;
      }

      if (data.user) {
        console.log('✅ Login Supabase bem-sucedido:', data.user.email);
        toast.success('Login realizado com sucesso!');
        // Não redirecionar automaticamente aqui, deixar o onAuthStateChange lidar
      }
    } catch (error: any) {
      console.error('Erro durante o login:', error);
      toast.error(`Erro ao fazer login: ${error.message}`);
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: Partial<Usuario>
  ) => {
    try {
      // 1. Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Criar registro na tabela usuarios
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          auth_id: authData.user.id,
          email,
          ...userData,
        });

      if (insertError) throw insertError;

      toast.success('Conta criada com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error: any) {
      toast.error(`Erro ao criar conta: ${error.message}`);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/login');
      toast.success('Logout realizado com sucesso!');
    } catch (error: any) {
      toast.error(`Erro ao fazer logout: ${error.message}`);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast.success('Email de recuperação enviado! Verifique sua caixa de entrada.');
    } catch (error: any) {
      toast.error(`Erro ao enviar email: ${error.message}`);
      throw error;
    }
  };

  const redirectByUserType = (userObj?: Usuario) => {
    const currentUser = userObj || user;
    if (!currentUser) {
      return;
    }

    switch (currentUser.tipo_usuario) {
      case 'superadmin':
        navigate('/superadmin');
        break;
      case 'admin_obs':
        navigate('/admin');
        break;
      case 'agente_saude':
        navigate('/agente');
        break;
      case 'populacao':
        navigate('/');
        break;
      default:
        navigate('/dashboard');
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
    redirectByUserType,
  };
}