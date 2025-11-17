import {
  Building2,
  Users,
  Home,
  LogOut,
  Settings,
  FileText,
  BarChart3,
  Shield,
  ClipboardList,
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/superadmin",
      icon: Home,
    },
    {
      title: "Gestão",
      url: "#",
      icon: Shield,
      items: [
        {
          title: "Organizações",
          url: "/superadmin/obs",
          icon: Building2,
        },
        {
          title: "Usuários", 
          url: "/superadmin/users",
          icon: Users,
        },
      ],
    },
    {
      title: "Relatórios",
      url: "/superadmin/reports",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Logs de Auditoria",
      url: "/superadmin/logs",
      icon: ClipboardList,
    },
    {
      title: "Configurações",
      url: "/superadmin/settings",
      icon: Settings,
    },
    {
      title: "Documentação",
      url: "/superadmin/docs",
      icon: FileText,
    },
  ],
};

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut, user } = useAuth();
  const { collapsible = "icon", ...rest } = props;

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Sidebar collapsible={collapsible} {...rest}>
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-2 transition-all group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
          <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg">
            <Building2 className="size-4" />
          </div>
          <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
            <span className="truncate font-semibold text-foreground">Multi-OBS</span>
            <span className="truncate text-xs text-muted-foreground">Sistema de Saúde</span>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        {/* Menu Principal */}
        <SidebarGroup>
          <SidebarGroupLabel>Menu Principal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navMain.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <>
                      <SidebarMenuButton
                        className="text-muted-foreground"
                        tooltip={item.title}
                      >
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </SidebarMenuButton>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton
                              asChild
                              isActive={location.pathname === subItem.url}
                            >
                              <Link to={subItem.url}>
                                <subItem.icon className="size-4" />
                                <span>{subItem.title}</span>
                              </Link>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </>
                  ) : (
                    <SidebarMenuButton
                      asChild
                      isActive={location.pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link to={item.url}>
                        <item.icon className="size-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Menu Secundário */}
        <SidebarGroup>
          <SidebarGroupLabel>Configurações</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navSecondary.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    tooltip={item.title}
                  >
                    <Link to={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="data-[state=open]:bg-accent data-[state=open]:text-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                  <Avatar className="h-6 w-6 rounded-lg">
                    <AvatarImage src="" alt={user?.nome} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-blue-600 to-blue-700 text-white text-xs">
                      {user?.nome?.charAt(0) || 'SA'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                    <span className="truncate font-semibold text-xs">{user?.nome || 'Super Admin'}</span>
                    <span className="truncate text-xs text-muted-foreground capitalize">{user?.tipo_usuario || 'superadmin'}</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="size-4" />
                  Configurações
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="cursor-pointer" onClick={handleSignOut}>
                  <LogOut className="size-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
