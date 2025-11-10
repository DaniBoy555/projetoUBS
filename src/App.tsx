import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SidebarProvider } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { SiteHeader } from '@/components/site-header';
import { Toaster } from '@/components/ui/sonner';
import Login from '@/pages/auth/Login';
import Dashboard from '@/pages/superadmin/Dashboard';
import OBSManagement from '@/pages/superadmin/OBSManagement';
import UserManagement from '@/pages/superadmin/UserManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Rota de login sem layout */}
        <Route path="/login" element={<Login />} />

        {/* Rotas protegidas com layout */}
        <Route
          path="/*"
          element={
            <SidebarProvider>
              <div className="flex min-h-screen w-full">
                <AppSidebar />
                <div className="flex flex-1 flex-col">
                  <SiteHeader />
                  <main className="flex-1 p-6">
                    <Routes>
                      <Route path="/" element={<Navigate to="/superadmin" replace />} />
                      <Route path="/superadmin" element={<Dashboard />} />
                      <Route path="/superadmin/obs" element={<OBSManagement />} />
                      <Route path="/superadmin/usuarios" element={<UserManagement />} />
                    </Routes>
                  </main>
                </div>
              </div>
              <Toaster />
            </SidebarProvider>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
