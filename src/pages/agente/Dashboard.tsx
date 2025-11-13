import { Calendar, UserPlus, FileText, MessageCircle, Users, Clock, MapPin, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function AgenteDashboard() {
  // Mock data específico para Agente de Saúde
  const agenteStats = {
    eventosHoje: 3,
    pessoasAgendadas: 25,
    duvidaspendentes: 8,
    atendimentosRealizados: 142
  };

  const agendaHoje = [
    { id: 1, evento: 'Vacinação Infantil', horario: '08:00-12:00', local: 'Sala 1', participantes: 15 },
    { id: 2, evento: 'Consulta Preventiva', horario: '14:00-16:00', local: 'Consultório 2', participantes: 8 },
    { id: 3, evento: 'Palestra Diabetes', horario: '19:00-20:00', local: 'Auditório', participantes: 35 },
  ];

  const duvidasUrgentes = [
    { id: 1, pessoa: 'Maria Silva', assunto: 'Dor no peito', tempo: '5 min', prioridade: 'alta' },
    { id: 2, pessoa: 'João Santos', assunto: 'Febre alta criança', tempo: '12 min', prioridade: 'alta' },
    { id: 3, pessoa: 'Ana Costa', assunto: 'Medicamento hipertensão', tempo: '25 min', prioridade: 'média' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Painel do Agente</h1>
              <p className="mt-1 text-sm text-gray-600">
                Área de Trabalho - Agente Maria da Silva - UBS Centro
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <Clock className="w-4 h-4 mr-1" />
                Turno Manhã
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
              <CardTitle className="text-sm font-medium">Eventos Hoje</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agenteStats.eventosHoje}</div>
              <p className="text-xs text-muted-foreground">
                Próximo às 08:00
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pessoas Agendadas</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agenteStats.pessoasAgendadas}</div>
              <p className="text-xs text-muted-foreground">
                Para hoje
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dúvidas Pendentes</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{agenteStats.duvidaspendentes}</div>
              <p className="text-xs text-muted-foreground">
                2 urgentes
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Atendimentos (Mês)</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{agenteStats.atendimentosRealizados}</div>
              <p className="text-xs text-muted-foreground">
                +18 desde semana passada
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Agenda Hoje */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Agenda de Hoje</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agendaHoje.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border-l-4 border-blue-500">
                    <div className="flex-1">
                      <h3 className="font-semibold">{item.evento}</h3>
                      <div className="flex items-center mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4 mr-1" />
                        {item.horario}
                        <MapPin className="h-4 w-4 mr-1 ml-3" />
                        {item.local}
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="outline">{item.participantes} pessoas</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Ações Rápidas */}
          <Card>
            <CardHeader>
              <CardTitle>Ações Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button className="w-full justify-start" size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Cadastrar Pessoa
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  Novo Evento
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <FileText className="h-4 w-4 mr-2" />
                  Relatório Diário
                </Button>
                <Button variant="outline" className="w-full justify-start" size="sm">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Ver Todas Dúvidas
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Dúvidas Urgentes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2 text-orange-500" />
              Dúvidas da População - Atenção Urgente
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {duvidasUrgentes.map((duvida) => (
                <div key={duvida.id} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                  <div className="flex-1">
                    <div className="flex items-center">
                      <h4 className="font-medium">{duvida.pessoa}</h4>
                      <Badge 
                        variant={duvida.prioridade === 'alta' ? 'destructive' : 'secondary'}
                        className="ml-2"
                      >
                        {duvida.prioridade}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{duvida.assunto}</p>
                    <p className="text-xs text-gray-500 mt-1">Aguardando há {duvida.tempo}</p>
                  </div>
                  <Button size="sm">Responder</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}