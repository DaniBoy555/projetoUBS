import { useMemo } from 'react';
import { Building2, Users, Calendar, HelpCircle, TrendingUp, Activity, ArrowUpRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOBS, mockUsuarios, mockEventos, mockDuvidas } from '@/lib/mock-data';

export default function Dashboard() {
  const navigate = useNavigate();

  // Cálculo de estatísticas
  const stats = useMemo(() => {
    const totalOBS = mockOBS.length;
    const obsAtivas = mockOBS.filter(obs => obs.status === 'ativo').length;
    const totalUsuarios = mockUsuarios.length;
    const usuariosAtivos = mockUsuarios.filter(u => u.status === 'ativo').length;
    const totalEventos = mockEventos.length;
    const totalDuvidas = mockDuvidas.length;
    const duvidasPendentes = mockDuvidas.filter(d => d.status === 'pendente').length;

    return {
      totalOBS,
      obsAtivas,
      percentualOBSAtivas: ((obsAtivas / totalOBS) * 100).toFixed(1),
      totalUsuarios,
      usuariosAtivos,
      percentualUsuariosAtivos: ((usuariosAtivos / totalUsuarios) * 100).toFixed(1),
      totalEventos,
      totalDuvidas,
      duvidasPendentes,
      percentualDuvidasPendentes: ((duvidasPendentes / totalDuvidas) * 100).toFixed(1),
    };
  }, []);

  // OBS recentes (últimas 5)
  const obsRecentes = useMemo(() => mockOBS.slice(0, 5), []);

  return (
    <div className="flex flex-col gap-6">
      {/* Cards de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de OBS</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOBS}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stats.percentualOBSAtivas}% ativas
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuários no Sistema</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {stats.usuariosAtivos} ativos
              </span>
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos de Saúde</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEventos}</div>
            <p className="text-xs text-muted-foreground">
              Eventos cadastrados no mês
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dúvidas da População</CardTitle>
            <HelpCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.duvidasPendentes}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-amber-600 flex items-center gap-1">
                Pendentes de {stats.totalDuvidas} total
              </span>
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* OBS Recentes */}
        <Card className="col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>OBS Recentes</CardTitle>
                <CardDescription>
                  Últimas organizações cadastradas no sistema
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/superadmin/obs')}
              >
                Ver todas
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Localização</TableHead>
                  <TableHead>Plano</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {obsRecentes.map((obs) => (
                  <TableRow key={obs.id}>
                    <TableCell className="font-medium">{obs.nome}</TableCell>
                    <TableCell>{obs.cidade}, {obs.estado}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          obs.plano === 'enterprise'
                            ? 'default'
                            : obs.plano === 'premium'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {obs.plano}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          obs.status === 'ativo'
                            ? 'default'
                            : obs.status === 'inativo'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {obs.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Ações Rápidas */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Ações Rápidas</CardTitle>
            <CardDescription>
              Acesse as principais funcionalidades
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Button
              className="justify-start"
              variant="outline"
              onClick={() => navigate('/superadmin/obs')}
            >
              <Building2 className="mr-2 h-4 w-4" />
              Gerenciar OBS
            </Button>
            <Button
              className="justify-start"
              variant="outline"
              onClick={() => navigate('/superadmin/users')}
            >
              <Users className="mr-2 h-4 w-4" />
              Gerenciar Usuários
            </Button>
            <Button
              className="justify-start"
              variant="outline"
              onClick={() => navigate('/superadmin/events')}
            >
              <Calendar className="mr-2 h-4 w-4" />
              Ver Eventos
            </Button>
            <Button
              className="justify-start"
              variant="outline"
              onClick={() => navigate('/superadmin/questions')}
            >
              <HelpCircle className="mr-2 h-4 w-4" />
              Dúvidas Pendentes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Distribuição por tipo de usuário */}
      <Card>
        <CardHeader>
          <CardTitle>Distribuição de Usuários por Tipo</CardTitle>
          <CardDescription>
            Quantidade de usuários em cada categoria do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <span className="text-sm text-muted-foreground">Super Admins</span>
              <span className="text-2xl font-bold">
                {mockUsuarios.filter(u => u.tipo_usuario === 'superadmin').length}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <span className="text-sm text-muted-foreground">Admin OBS</span>
              <span className="text-2xl font-bold">
                {mockUsuarios.filter(u => u.tipo_usuario === 'admin_obs').length}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <span className="text-sm text-muted-foreground">Agentes de Saúde</span>
              <span className="text-2xl font-bold">
                {mockUsuarios.filter(u => u.tipo_usuario === 'agente_saude').length}
              </span>
            </div>
            <div className="flex flex-col gap-2 rounded-lg border p-4">
              <span className="text-sm text-muted-foreground">População</span>
              <span className="text-2xl font-bold">
                {mockUsuarios.filter(u => u.tipo_usuario === 'populacao').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
