import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured, type Usuario } from '@/lib/supabase';
import { toast } from 'sonner';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoadingUserData, setIsLoadingUserData] = useState(false);
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
    // Evitar múltiplas chamadas simultâneas
    if (isLoadingUserData) {
      return;
    }

    setIsLoadingUserData(true);
    try {

      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .maybeSingle();

      if (error) {
        throw error;
      }


      // Debug: Se não encontrou, verificar se existem usuários na tabela
      if (!data) {
        

        toast.error('Usuário não encontrado no sistema. Contate o administrador.');
        await supabase.auth.signOut();
        setUser(null);
        navigate('/login');
        return;
      }

      setUser(data);

      // Redirecionar automaticamente se solicitado
      if (shouldRedirect) {
        setTimeout(() => redirectByUserType(data), 500);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUserData(false);
    }
  };

  const signIn = async (email: string, password: string, demoUserType?: string, forceDemo = false) => {
    try {
      
      // Check for demo mode ONLY if explicitly forced
      if (forceDemo) {
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

      // If Supabase is not configured, require valid credentials even for demo
      if (!isSupabaseConfigured) {
        toast.error('Sistema não configurado. Entre em contato com o administrador.');
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ Erro Supabase:', error);
        
        // If login fails, show error and don't automatically switch to demo
        if (error.message.includes('Invalid login credentials')) {
            toast.error('Credenciais inválidas. Verifique email e senha.');
          return;
        }
        
        throw error;
      }


      if (data.user) {
        await loadUserData(data.user.id, true); // true para redirecionar automaticamente
        toast.success('Login realizado com sucesso!');
      }
    } catch (error: any) {
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