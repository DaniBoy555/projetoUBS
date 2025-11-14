import * as React from "react"
import {
  Building2,
  Users,
  Calendar,
  HelpCircle,
  LayoutDashboardIcon,
  Settings,
  BarChart3,
  FileText,
  Shield,
  Activity,
} from "lucide-react"
import { useNavigate } from "react-router-dom"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "Super Admin",
    email: "superadmin@multiobs.com",
    avatar: "/avatars/admin.jpg",
  },
  navMain: [
    {
      title: "Dashboard",
      url: "/superadmin",
      icon: LayoutDashboardIcon,
    },
    {
      title: "Gestão de OBS",
      url: "/superadmin/obs",
      icon: Building2,
    },
    {
      title: "Gestão de Usuários",
      url: "/superadmin/users",
      icon: Users,
    },
    {
      title: "Eventos de Saúde",
      url: "/superadmin/events",
      icon: Calendar,
    },
    {
      title: "Dúvidas da População",
      url: "/superadmin/questions",
      icon: HelpCircle,
    },
    {
      title: "Relatórios",
      url: "/superadmin/reports",
      icon: FileText,
    },
    {
      title: "Analytics",
      url: "/superadmin/analytics",
      icon: BarChart3,
    },
  ],
  navSecondary: [
    {
      title: "Configurações",
      url: "/superadmin/settings",
      icon: Settings,
    },
    {
      title: "Logs de Auditoria",
      url: "/superadmin/audit",
      icon: Activity,
    },
    {
      title: "Segurança",
      url: "/superadmin/security",
      icon: Shield,
    },
  ],
}

export function SuperAdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const navigate = useNavigate()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              onClick={() => navigate('/superadmin')}
              className="cursor-pointer"
            >
              <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Shield className="size-4" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold">Multi-OBS Saúde</span>
                <span className="truncate text-xs">Super Admin</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
