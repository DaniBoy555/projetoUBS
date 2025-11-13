import { Building2, Users, Calendar, Heart, TrendingUp, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AdminOBSDashboard() {
  // Mock data específico para Admin OBS
  const obsStats = {
    agentesAtivos: 12,
    eventosEsteAno: 45,
    populacaoAtendida: 8500,
    duvidaspendentes: 23
  };

  const eventosRecentes = [
    { id: 1, titulo: 'Campanha de Vacinação COVID-19', data: '2025-11-15', status: 'ativo' },
    { id: 2, titulo: 'Palestra sobre Diabetes', data: '2025-11-20', status: 'agendado' },
    { id: 3, titulo: 'Mutirão de Mamografia', data: '2025-11-25', status: 'agendado' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin OBS</h1>
              <p className="mt-1 text-sm text-gray-600">Painel Administrativo - OBS São Paulo Centro</p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Clock className="w-4 h-4 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Agentes Ativos</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{obsStats.agentesAtivos}</div>
              <p className="text-xs text-muted-foreground">
                +2 novos este mês
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos 2025</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{obsStats.eventosEsteAno}</div>
              <p className="text-xs text-muted-foreground">
                +12% em relação ao ano passado
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">População Atendida</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{obsStats.populacaoAtendida.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Pessoas cadastradas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dúvidas Pendentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{obsStats.duvidaspendentes}</div>
              <p className="text-xs text-muted-foreground">
                -5 desde ontem
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Events */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Eventos Recentes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {eventosRecentes.map((evento) => (
                  <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium">{evento.titulo}</p>
                      <p className="text-sm text-gray-600">{evento.data}</p>
                    </div>
                    <Badge 
                      variant={evento.status === 'ativo' ? 'default' : 'secondary'}
                      className={evento.status === 'ativo' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {evento.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                <Button className="h-20 flex-col">
                  <Calendar className="h-6 w-6 mb-2" />
                  Novo Evento
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Users className="h-6 w-6 mb-2" />
                  Gerenciar Agentes
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <Heart className="h-6 w-6 mb-2" />
                  Dúvidas da População
                </Button>
                <Button variant="outline" className="h-20 flex-col">
                  <TrendingUp className="h-6 w-6 mb-2" />
                  Relatórios
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}