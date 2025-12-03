import { useMemo, useState } from 'react';
import { Building2, Users, Calendar, HelpCircle, TrendingUp, Activity, ArrowUpRight, Shield, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FormOBS } from "@/components/forms/FormOBS";
import { FormUser } from "@/components/forms/FormUser";
import { mockOBS, mockUsuarios, mockEventos, mockDuvidas } from '@/lib/mock-data';

export default function Dashboard() {
  const navigate = useNavigate();
  const [openOBS, setOpenOBS] = useState(false);
  const [openUser, setOpenUser] = useState(false);

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
      {/* Header da página */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao painel de controle do sistema Multi-OBS
        </p>
      </div>

      {/* Cards de estatísticas principais */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-l-4 border-l-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">Total de OBS</CardTitle>
            <div className="p-2 bg-blue-500 rounded-lg">
              <Building2 className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{stats.totalOBS}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                {stats.percentualOBSAtivas}% ativas
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">Usuários no Sistema</CardTitle>
            <div className="p-2 bg-green-500 rounded-lg">
              <Users className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{stats.totalUsuarios}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                {stats.usuariosAtivos} ativos
              </span>
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700 dark:text-purple-300">Eventos de Saúde</CardTitle>
            <div className="p-2 bg-purple-500 rounded-lg">
              <Calendar className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">{stats.totalEventos}</div>
            <p className="text-xs text-muted-foreground">
              Eventos cadastrados no mês
            </p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/50 dark:to-orange-900/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">Dúvidas da População</CardTitle>
            <div className="p-2 bg-orange-500 rounded-lg">
              <HelpCircle className="h-4 w-4 text-white" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{stats.duvidasPendentes}</div>
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
            <Dialog open={openOBS} onOpenChange={setOpenOBS}>
              <DialogTrigger asChild>
                <Button className="justify-start w-full" variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Nova OBS
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Nova Organização de Saúde</DialogTitle>
                </DialogHeader>
                <FormOBS onSuccess={() => setOpenOBS(false)} onCancel={() => setOpenOBS(false)} />
              </DialogContent>
            </Dialog>

            <Dialog open={openUser} onOpenChange={setOpenUser}>
              <DialogTrigger asChild>
                <Button className="justify-start w-full" variant="default">
                  <Plus className="mr-2 h-4 w-4" />
                  Novo Usuário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Novo Usuário</DialogTitle>
                </DialogHeader>
                <FormUser onSuccess={() => setOpenUser(false)} onCancel={() => setOpenUser(false)} />
              </DialogContent>
            </Dialog>

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
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-blue-600" />
            Distribuição de Usuários por Tipo
          </CardTitle>
          <CardDescription>
            Quantidade de usuários em cada categoria do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col gap-3 rounded-lg border-2 border-red-200 bg-gradient-to-br from-red-50 to-red-100 p-4 dark:from-red-950/30 dark:to-red-900/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-red-500 rounded-md">
                  <Shield className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-red-700 dark:text-red-300">Super Admins</span>
              </div>
              <span className="text-2xl font-bold text-red-900 dark:text-red-100">
                {mockUsuarios.filter(u => u.tipo_usuario === 'superadmin').length}
              </span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-950/30 dark:to-blue-900/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-blue-500 rounded-md">
                  <Building2 className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Admin OBS</span>
              </div>
              <span className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {mockUsuarios.filter(u => u.tipo_usuario === 'admin_obs').length}
              </span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border-2 border-green-200 bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-950/30 dark:to-green-900/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-green-500 rounded-md">
                  <Activity className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-green-700 dark:text-green-300">Agentes de Saúde</span>
              </div>
              <span className="text-2xl font-bold text-green-900 dark:text-green-100">
                {mockUsuarios.filter(u => u.tipo_usuario === 'agente_saude').length}
              </span>
            </div>
            <div className="flex flex-col gap-3 rounded-lg border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-950/30 dark:to-purple-900/30">
              <div className="flex items-center gap-2">
                <div className="p-1.5 bg-purple-500 rounded-md">
                  <Users className="h-3 w-3 text-white" />
                </div>
                <span className="text-sm font-medium text-purple-700 dark:text-purple-300">População</span>
              </div>
              <span className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {mockUsuarios.filter(u => u.tipo_usuario === 'populacao').length}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
