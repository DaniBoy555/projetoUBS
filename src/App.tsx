import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/sonner';
import { LoginForm } from '@/components/login-form';
import Dashboard from '@/pages/superadmin/Dashboard';

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

// Dashboard simples para teste
function SimpleDashboard() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold">Dashboard - Sistema Multi-OBS</h1>
      <p className="text-muted-foreground">Login realizado com sucesso!</p>
      <div className="mt-6">
        <Dashboard />
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
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/dashboard" element={<SimpleDashboard />} />
          <Route path="/superadmin" element={<SimpleDashboard />} />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
