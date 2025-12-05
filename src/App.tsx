import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { ThemeProvider } from '@/components/theme-provider';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import Dashboard from '@/pages/superadmin/Dashboard';
import SuperAdminLayout from '@/pages/superadmin/Layout';
import UserManagement from '@/pages/superadmin/UserManagement';
import OBSManagement from '@/pages/superadmin/OBSManagement';
import AuditLogs from '@/pages/superadmin/AuditLogs';
import SuperAdminReports from '@/pages/superadmin/Reports';
import SuperAdminSettings from '@/pages/superadmin/Settings';
import SuperAdminDocs from '@/pages/superadmin/Docs';
import AdminOBSDashboard from '@/pages/admin-obs/Dashboard';
import AdminOBSAgentes from '@/pages/admin-obs/Agentes';
import AdminOBSEventos from '@/pages/admin-obs/Eventos';
import AgenteDashboard from '@/pages/agente/Dashboard';
import PopulacaoHome from '@/pages/populacao/Home';
import AuthLogin from '@/pages/auth/Login';

// Componente de redirecionamento inteligente baseado no usuário
function RootRedirect() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="text-sm text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirecionar baseado no tipo de usuário
  switch (user.tipo_usuario) {
    case 'superadmin':
      return <Navigate to="/superadmin" replace />;
    case 'admin_obs':
      return <Navigate to="/admin" replace />;
    case 'agente_saude':
      return <Navigate to="/agente" replace />;
    case 'populacao':
      return <Navigate to="/portal" replace />;
    default:
      return <Navigate to="/login" replace />;
  }
}

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

function App() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            {/* Rota de Login - Acessível publicamente */}
            <Route path="/login" element={<AuthLogin />} />

            {/* Portal Público - Acessível sem autenticação */}
            <Route path="/public" element={<PopulacaoHome />} />

            {/* ===== ROTAS PROTEGIDAS ===== */}

            {/* Super Admin - Acesso total ao sistema */}
            <Route
              path="/superadmin"
              element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="obs" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <OBSManagement />
                </ProtectedRoute>
              } />
              <Route path="users" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="logs" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <AuditLogs />
                </ProtectedRoute>
              } />
              <Route path="reports" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminReports />
                </ProtectedRoute>
              } />
              <Route path="settings" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminSettings />
                </ProtectedRoute>
              } />
              <Route path="docs" element={
                <ProtectedRoute allowedRoles={['superadmin']}>
                  <SuperAdminDocs />
                </ProtectedRoute>
              } />
            </Route>

            {/* Admin OBS - Gestão de uma OBS específica */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin_obs']}>
                  <AdminOBSDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/agentes"
              element={
                <ProtectedRoute allowedRoles={['admin_obs']}>
                  <AdminOBSAgentes />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/eventos"
              element={
                <ProtectedRoute allowedRoles={['admin_obs']}>
                  <AdminOBSEventos />
                </ProtectedRoute>
              }
            />

            {/* Agente de Saúde - Operações do dia a dia */}
            <Route
              path="/agente"
              element={
                <ProtectedRoute allowedRoles={['agente_saude']}>
                  <AgenteDashboard />
                </ProtectedRoute>
              }
            />

            {/* População - Portal cidadão (protegido para usuários população) */}
            <Route
              path="/portal"
              element={
                <ProtectedRoute allowedRoles={['populacao']}>
                  <PopulacaoHome />
                </ProtectedRoute>
              }
            />

            {/* ===== REDIRECIONAMENTOS ===== */}

            {/* Rota raiz - redireciona baseado no status de autenticação */}
            <Route path="/" element={<RootRedirect />} />

            {/* Rotas de compatibilidade */}
            <Route path="/dashboard" element={<Navigate to="/login" replace />} />

            {/* Fallback - qualquer rota não encontrada vai para login */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          <Toaster />
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
