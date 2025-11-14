import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import type { TipoUsuario } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: TipoUsuario[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Debug logs
  console.log('🛡️ ProtectedRoute Check:', {
    path: location.pathname,
    user: user ? { id: user.id, tipo: user.tipo_usuario, nome: user.nome } : null,
    loading,
    allowedRoles,
    hasAccess: allowedRoles ? allowedRoles.includes(user?.tipo_usuario as TipoUsuario) : true
  });

  // Mostrar loading enquanto verifica autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  // Usuário não autenticado - redirecionar para login
  if (!user) {
    console.log('🚫 Usuário não autenticado, redirecionando para /login');
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Verificar permissões baseadas em roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(user.tipo_usuario);
    
    if (!hasPermission) {
      console.log('🚫 Usuário sem permissão:', {
        userType: user.tipo_usuario,
        allowedRoles,
        redirectingTo: getRedirectPath(user.tipo_usuario)
      });
      
      // Redirecionar para a rota apropriada baseada no tipo de usuário
      return <Navigate to={getRedirectPath(user.tipo_usuario)} replace />;
    }
  }

  console.log('✅ Acesso autorizado para:', location.pathname);
  return <>{children}</>;
}

// Função para determinar onde redirecionar baseado no tipo de usuário
function getRedirectPath(tipoUsuario: TipoUsuario): string {
  switch (tipoUsuario) {
    case 'superadmin':
      return '/superadmin';
    case 'admin_obs':
      return '/admin';
    case 'agente_saude':
      return '/agente';
    case 'populacao':
      return '/portal';
    default:
      return '/login';
  }
}