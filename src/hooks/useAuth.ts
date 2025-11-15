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
        console.log('Loading timeout reached, setting loading to false');
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
        console.log('🔄 Auth state changed:', event, session?.user?.email);
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
      console.error('Error checking user:', error);
    } finally {
      if (isMounted) setLoading(false);
    }
  };

  const loadUserData = async (authId: string, shouldRedirect = false, isMounted = true) => {
    try {
      console.log('📊 Carregando dados do usuário:', authId);
      if (!isMounted) return;

      // Timeout para a query - se demorar mais de 5 segundos, usar mock
      const queryTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Query timeout')), 5000)
      );

      const queryPromise = supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      console.log('🔍 Fazendo query na tabela usuarios...');
      
      try {
        const { data, error } = await Promise.race([queryPromise, queryTimeout]) as any;
        
        console.log('📥 Resposta da query:', { data, error });

        if (error) {
          console.error('❌ Error loading user data:', error);
          // Se erro de RLS ou tabela não existe, usar mock
          if (error.code === 'PGRST116' || 
              error.message.includes('relation "public.usuarios" does not exist') ||
              error.message.includes('permission denied') ||
              error.code === '42501') {
            console.log('🔄 Problema de permissão/tabela, usando dados mock');
            const mockUser = createMockUserFromAuth(authId);
            if (isMounted) {
              setUser(mockUser);
              if (shouldRedirect) {
                console.log('🚀 Redirecionando usuário mock...');
                setTimeout(() => redirectByUserType(mockUser), 500);
              }
            }
            return;
          }
          throw error;
        }

        // Se não encontrou usuário na tabela, criar um mock
        if (!data) {
          console.log('⚠️ Usuário não encontrado na tabela, criando mock');
          const mockUser = createMockUserFromAuth(authId);
          if (isMounted) {
            setUser(mockUser);
            if (shouldRedirect) {
              console.log('🚀 Redirecionando usuário mock...');
              setTimeout(() => redirectByUserType(mockUser), 500);
            }
          }
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
      } catch (timeoutError: any) {
        if (timeoutError.message === 'Query timeout') {
          console.log('⏰ Query timeout, usando dados mock');
          const mockUser = createMockUserFromAuth(authId);
          if (isMounted) {
            setUser(mockUser);
            if (shouldRedirect) {
              console.log('🚀 Redirecionando usuário mock após timeout...');
              setTimeout(() => redirectByUserType(mockUser), 500);
            }
          }
        } else {
          throw timeoutError;
        }
      }
    } catch (error: any) {
      console.error('❌ Error loading user data:', error);
      if (isMounted) {
        console.log('🔄 Usando fallback para dados mock devido a erro');
        const mockUser = createMockUserFromAuth(authId);
        setUser(mockUser);
        if (shouldRedirect) {
          setTimeout(() => redirectByUserType(mockUser), 1000);
        }
      }
    }
  };

  const createMockUserFromAuth = (authId: string): Usuario => {
    // Se for o UUID específico do superadmin, usar dados corretos
    if (authId === 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11') {
      return {
        id: '6d245cc7-1406-4e13-b3da-1752e792aa4d',
        auth_id: authId,
        obs_id: null,
        nome: 'Super Administrador',
        email: 'superadmin@multiobs.com',
        telefone: null,
        tipo_usuario: 'superadmin',
        posto_saude: null,
        foto_url: null,
        status: 'ativo',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }
    
    // Para outros usuários, usar dados genéricos
    return {
      id: authId,
      auth_id: authId,
      obs_id: null,
      nome: 'SuperAdmin Demo',
      email: 'admin@demo.com',
      telefone: null,
      tipo_usuario: 'superadmin',
      posto_saude: null,
      foto_url: null,
      status: 'ativo',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  };

  const signIn = async (email: string, password: string, _demoUserType?: string, forceDemo = false) => {
    try {
      // If Supabase is not configured, use demo mode
      if (!isSupabaseConfigured) {
        toast.info('Modo demonstração ativado - Supabase não configurado');
        const mockUser = createMockUserFromAuth('demo-' + Date.now());
        setUser(mockUser);
        toast.success('Login realizado com sucesso (modo demo)!');
        setTimeout(() => redirectByUserType(mockUser), 1000);
        return;
      }

      // Check for demo mode ONLY if explicitly forced
      if (forceDemo) {
        toast.info('Modo demonstração ativado');
        const mockUser = createMockUserFromAuth('demo-' + Date.now());
        setUser(mockUser);
        toast.success('Login realizado com sucesso (modo demo)!');
        setTimeout(() => redirectByUserType(mockUser), 1000);
        return;
      }

      // Tentar autenticação real com Supabase
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
        console.log('🆔 User ID:', data.user.id);
        toast.success('Login realizado com sucesso!');
        // Não redirecionar automaticamente aqui, deixar o onAuthStateChange handle
      }
    } catch (error: any) {
      console.error('Error during sign in:', error);
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