import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginForm } from '@/components/login-form';

// Componente simples para Login
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
    </div>
  );
}

function AppWorking() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<SimpleDashboard />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppWorking;