import { useEffect, useState } from 'react';
import { Users, Calendar, Heart, TrendingUp, Clock, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export default function AdminOBSDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    agentesAtivos: 0,
    eventosEsteAno: 0,
    populacaoAtendida: 0,
    duvidasPendentes: 0
  });
  const [eventosRecentes, setEventosRecentes] = useState<any[]>([]);

  useEffect(() => {
    if (user?.obs_id) {
      loadDashboardData(user.obs_id);
    }
  }, [user?.obs_id]);

  const loadDashboardData = async (obsId: string) => {
    try {
      setLoading(true);

      // 1. Buscar Agentes Ativos
      const { count: agentesCount, error: agentesError } = await supabase
        .from('usuarios')
        .select('*', { count: 'exact', head: true })
        .eq('obs_id', obsId)
        .eq('tipo_usuario', 'agente_saude')
        .eq('status', 'ativo');

      if (agentesError) throw agentesError;

      // 2. Buscar Eventos do Ano
      const startOfYear = new Date(new Date().getFullYear(), 0, 1).toISOString();
      const { count: eventosCount, error: eventosError } = await supabase
        .from('eventos_saude')
        .select('*', { count: 'exact', head: true })
        .eq('obs_id', obsId)
        .gte('data_inicio', startOfYear);

      if (eventosError) throw eventosError;

      // 3. Buscar Dúvidas Pendentes
      const { count: duvidasCount, error: duvidasError } = await supabase
        .from('duvidas_populacao')
        .select('*', { count: 'exact', head: true })
        .eq('obs_id', obsId)
        .eq('status', 'pendente');

      if (duvidasError) throw duvidasError;

      // 4. Buscar Eventos Recentes
      const { data: eventosData, error: eventosListError } = await supabase
        .from('eventos_saude')
        .select('*')
        .eq('obs_id', obsId)
        .order('data_inicio', { ascending: false })
        .limit(5);

      if (eventosListError) throw eventosListError;

      setStats({
        agentesAtivos: agentesCount || 0,
        eventosEsteAno: eventosCount || 0,
        populacaoAtendida: 0, // Este dado pode vir de uma tabela futura de pacientes
        duvidasPendentes: duvidasCount || 0
      });

      setEventosRecentes(eventosData || []);

    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar informações do dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (!user?.obs_id) {
    return (
      <div className="flex flex-col items-center justify-center h-[50vh] text-center">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold">Nenhuma OBS Vinculada</h2>
        <p className="text-muted-foreground mt-2">
          Seu usuário não está vinculado a nenhuma Organização de Saúde.
          Entre em contato com o administrador.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Admin OBS</h1>
              <p className="mt-1 text-sm text-gray-600">Painel Administrativo - Gestão Local</p>
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
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.agentesAtivos}
              </div>
              <p className="text-xs text-muted-foreground">
                Profissionais cadastrados
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Eventos {new Date().getFullYear()}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.eventosEsteAno}
              </div>
              <p className="text-xs text-muted-foreground">
                Campanhas e ações
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">População Atendida</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.populacaoAtendida}
              </div>
              <p className="text-xs text-muted-foreground">
                Estimativa local
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Dúvidas Pendentes</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {loading ? '...' : stats.duvidasPendentes}
              </div>
              <p className="text-xs text-muted-foreground">
                Aguardando resposta
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
                {loading ? (
                  <p className="text-sm text-gray-500">Carregando eventos...</p>
                ) : eventosRecentes.length === 0 ? (
                  <p className="text-sm text-gray-500">Nenhum evento recente encontrado.</p>
                ) : (
                  eventosRecentes.map((evento) => (
                    <div key={evento.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{evento.titulo}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <Badge
                        variant={evento.status === 'ativo' ? 'default' : 'secondary'}
                        className={evento.status === 'ativo' ? 'bg-green-100 text-green-800' : ''}
                      >
                        {evento.status}
                      </Badge>
                    </div>
                  ))
                )}
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