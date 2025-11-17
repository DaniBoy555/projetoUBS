import { Outlet, useLocation } from 'react-router-dom';
import { SidebarProvider, SidebarTrigger, SidebarInset } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';

export default function SuperAdminLayout() {
  const location = useLocation();

  const getCurrentBreadcrumb = () => {
    const path = location.pathname;
    if (path === '/superadmin') return 'Dashboard';
    if (path === '/superadmin/obs') return 'Organizações';
    if (path === '/superadmin/users') return 'Usuários';
    if (path === '/superadmin/reports') return 'Relatórios';
    if (path === '/superadmin/logs') return 'Logs de Auditoria';
    if (path === '/superadmin/settings') return 'Configurações';
    if (path === '/superadmin/docs') return 'Documentação';
    return 'Dashboard';
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex items-center gap-2">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/superadmin">Super Admin</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{getCurrentBreadcrumb()}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        
        <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
