import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LoginForm } from '@/components/login-form';
import SuperAdminLayout from '@/pages/superadmin/Layout';
import Dashboard from '@/pages/superadmin/Dashboard';
import UserManagement from '@/pages/superadmin/UserManagement';
import OBSManagement from '@/pages/superadmin/OBSManagement';
import AdminOBSDashboard from '@/pages/admin-obs/Dashboard';
import AgenteDashboard from '@/pages/agente/Dashboard';
import PopulacaoHome from '@/pages/populacao/Home';

// Componente de Login Customizado
function LoginPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  );
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
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Rotas do Super Admin com Sidebar */}
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="obs" element={<OBSManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Rotas por tipo de usuário */}
          <Route path="/admin" element={<AdminOBSDashboard />} />
          <Route path="/agente" element={<AgenteDashboard />} />
          <Route path="/" element={<PopulacaoHome />} />

          {/* Rota de fallback */}
          <Route path="/dashboard" element={<Navigate to="/superadmin" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
