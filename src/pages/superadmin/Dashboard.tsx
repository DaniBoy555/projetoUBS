import { Building2, Users, Calendar, HelpCircle } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard SuperAdmin</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema Multi-OBS Saúde
        </p>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total de OBS"
          value={0}
          icon={Building2}
          description="Organizações cadastradas"
        />
        <StatCard
          title="Usuários Ativos"
          value={0}
          icon={Users}
          description="Usuários no sistema"
        />
        <StatCard
          title="Eventos do Mês"
          value={0}
          icon={Calendar}
          description="Eventos agendados"
        />
        <StatCard
          title="Dúvidas Pendentes"
          value={0}
          icon={HelpCircle}
          description="Aguardando resposta"
        />
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
              <Building2 className="h-6 w-6" />
              Nova OBS
            </Button>
            <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
              <Users className="h-6 w-6" />
              Gerenciar Usuários
            </Button>
            <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
              <Calendar className="h-6 w-6" />
              Ver Eventos
            </Button>
            <Button className="h-auto py-4 flex flex-col gap-2" variant="outline">
              <HelpCircle className="h-6 w-6" />
              Suporte
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Lista de OBS Recentes */}
      <Card>
        <CardHeader>
          <CardTitle>OBS Recentes</CardTitle>
          <CardDescription>
            Últimas organizações cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            Nenhuma OBS cadastrada ainda.
            <br />
            Clique em "Nova OBS" para começar.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
