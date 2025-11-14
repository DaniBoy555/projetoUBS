import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, type Usuario } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sessão existente
    checkUser();

    if (!isSupabaseConfigured) {
      return;
    }

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      if (!isSupabaseConfigured) {
        // No modo demonstração, não há usuário logado inicialmente
        setLoading(false);
        return;
      }

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (authId: string, shouldRedirect = false) => {
    try {
      console.log('📋 Carregando dados para authId:', authId);
      
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) {
        console.error('❌ Erro ao carregar usuário:', error);
        throw error;
      }
      
      console.log('✅ Dados do usuário carregados:', data);
      setUser(data);
      
      // Redirecionar automaticamente se solicitado
      if (shouldRedirect) {
        console.log('🔀 Redirecionando usuário tipo:', data.tipo_usuario);
        setTimeout(() => redirectByUserType(data), 500);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string, demoUserType?: string, forceDemo = false) => {
    try {
      console.log('🔍 Login Debug:', { 
        email, 
        isSupabaseConfigured, 
        demoUserType,
        forceDemo,
        supabaseUrl: import.meta.env.VITE_SUPABASE_URL 
      });
      
      // Check for demo mode first (either forced or not configured)
      if (!isSupabaseConfigured || forceDemo) {
        console.log('🧪 Executando modo demo');
        toast.info('Modo demonstração ativado');
        
        // Simular usuário para teste baseado no tipo selecionado
        const userType = demoUserType as 'superadmin' | 'admin_obs' | 'agente_saude' | 'populacao' || 'superadmin';
        
        const userNames = {
          superadmin: 'SuperAdmin Demo',
          admin_obs: 'Admin OBS Demo',
          agente_saude: 'Agente Maria Silva',
          populacao: 'Usuário Público'
        };
        
        const mockUser: Usuario = {
          id: '1',
          auth_id: '1',
          obs_id: userType === 'superadmin' ? null : '1',
          nome: userNames[userType],
          email: email,
          telefone: null,
          tipo_usuario: userType,
          posto_saude: userType === 'agente_saude' ? 'UBS Centro' : null,
          foto_url: null,
          status: 'ativo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        toast.success('Login realizado com sucesso (modo demo)!');
        console.log('🔄 Redirecionando para:', userType);
        
        setTimeout(() => {
          // Redirect baseado no tipo de usuário mock
          switch (mockUser.tipo_usuario) {
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
        }, 1000);
        return;
      }

      console.log('📡 Tentando login no Supabase...');
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro Supabase:', error);
        
        // If login fails, offer demo fallback
        if (error.message.includes('Invalid login credentials')) {
          console.log('🔄 Login falhou, oferecendo modo demo...');
          toast.error(`Credenciais inválidas. Usando modo demo.`);
          
          // Automatically switch to demo mode
          setTimeout(() => {
            signIn(email, password, demoUserType, true);
          }, 1500);
          return;
        }
        
        throw error;
      }

      console.log('✅ Login Supabase OK:', data.user?.id);

      if (data.user) {
        console.log('👤 Carregando dados do usuário...');
        await loadUserData(data.user.id, true); // true para redirecionar automaticamente
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
      console.error('🚫 Erro final no login:', error);
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
      console.warn('No user data available for redirect');
      return;
    }

    console.log('Redirecting user type:', currentUser.tipo_usuario);

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