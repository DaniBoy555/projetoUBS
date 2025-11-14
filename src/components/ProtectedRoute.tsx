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
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  // Verificar permissões baseadas em roles
  if (allowedRoles && allowedRoles.length > 0) {
    const hasPermission = allowedRoles.includes(user.tipo_usuario);
    
    if (!hasPermission) {
      // Redirecionar para a rota apropriada baseada no tipo de usuário
      return <Navigate to={getRedirectPath(user.tipo_usuario)} replace />;
    }
  }

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