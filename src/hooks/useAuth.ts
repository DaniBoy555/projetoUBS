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

  const loadUserData = async (authId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      if (!isSupabaseConfigured) {
        // Simulação de login para demonstração
        toast.info('Modo demonstração - Supabase não configurado');
        
        // Simular usuário para teste
        const mockUser: Usuario = {
          id: '1',
          auth_id: '1',
          obs_id: '1',
          nome: 'SuperAdmin Demo',
          email: email,
          telefone: null,
          tipo_usuario: 'superadmin',
          posto_saude: null,
          foto_url: null,
          status: 'ativo',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
        
        setUser(mockUser);
        toast.success('Login realizado com sucesso (modo demo)!');
        setTimeout(() => redirectByUserType(), 1000);
        return;
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id);
        toast.success('Login realizado com sucesso!');
        
        // Redirect baseado no tipo de usuário
        redirectByUserType();
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

  const redirectByUserType = () => {
    if (!user) return;

    switch (user.tipo_usuario) {
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
        navigate('/');
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