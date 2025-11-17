import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockLogs, mockOBS } from '@/lib/mock-data';

const actionLabels: Record<string, string> = {
  criar_evento: 'Criação de evento',
  editar_obs: 'Atualização de OBS',
  criar_obs: 'Criação de OBS',
  acessar_sistema: 'Acesso ao sistema',
};

const dateFormatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeStyle: 'short',
});

export default function AuditLogs() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedObs, setSelectedObs] = useState<string>('todos');

  const obsOptions = useMemo(
    () =>
      mockOBS.map((obs) => ({
        id: obs.id,
        label: `${obs.nome} (${obs.cidade}/${obs.estado})`,
      })),
    []
  );

  const metrics = useMemo(() => {
    const uniqueUsers = new Set(mockLogs.map((log) => log.usuario_id));
    const today = new Date();
    const last24Hours = mockLogs.filter((log) => {
      const diff = today.getTime() - new Date(log.created_at).getTime();
      return diff <= 24 * 60 * 60 * 1000;
    });

    return {
      totalLogs: mockLogs.length,
      totalUsers: uniqueUsers.size,
      last24Hours: last24Hours.length,
    };
  }, []);

  const filteredLogs = useMemo(() => {
    return mockLogs
      .filter((log) => {
        const matchesObs =
          selectedObs === 'todos' ||
          (selectedObs === 'null'
            ? log.obs_id === null
            : log.obs_id === selectedObs);
        const term = searchTerm.toLowerCase();
        const matchesSearch =
          log.usuario_nome.toLowerCase().includes(term) ||
          log.descricao.toLowerCase().includes(term) ||
          log.acao.toLowerCase().includes(term);

        return matchesObs && matchesSearch;
      })
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
  }, [searchTerm, selectedObs]);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Logs de Auditoria</h1>
        <p className="text-muted-foreground">
          Acompanhe todas as ações críticas realizadas no sistema Multi-OBS.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Ações Registradas</CardTitle>
            <CardDescription>Total de entradas no histórico</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{metrics.totalLogs}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Usuários Envolvidos</CardTitle>
            <CardDescription>Perfis com ações registradas</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{metrics.totalUsers}</CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Últimas 24h</CardTitle>
            <CardDescription>Atividades recentes</CardDescription>
          </CardHeader>
          <CardContent className="text-3xl font-bold">{metrics.last24Hours}</CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
          <CardDescription>Busque por usuário, ação ou descrição.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <Input
            placeholder="Buscar por usuário ou ação..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
          <Select value={selectedObs} onValueChange={setSelectedObs}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por OBS" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todas as OBS</SelectItem>
              {obsOptions.map((obs) => (
                <SelectItem key={obs.id} value={obs.id}>
                  {obs.label}
                </SelectItem>
              ))}
              <SelectItem value="null">Ações do sistema (sem OBS)</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Ações</CardTitle>
          <CardDescription>
            Registros ordenados por data de criação.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Quando</TableHead>
                <TableHead>Usuário</TableHead>
                <TableHead>Ação</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>OBS</TableHead>
                <TableHead className="text-right">IP</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="whitespace-nowrap text-sm text-muted-foreground">
                    {dateFormatter.format(new Date(log.created_at))}
                  </TableCell>
                  <TableCell className="font-medium">{log.usuario_nome}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {actionLabels[log.acao] ?? log.acao.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-xs">
                    <p className="text-sm text-muted-foreground">{log.descricao}</p>
                  </TableCell>
                  <TableCell className="text-sm">
                    {log.obs_id
                      ? obsOptions.find((obs) => obs.id === log.obs_id)?.label ?? '-'
                      : 'Sistema'}
                  </TableCell>
                  <TableCell className="text-right text-sm text-muted-foreground">
                    {log.ip_address ?? '-'}
                  </TableCell>
                </TableRow>
              ))}
              {filteredLogs.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="py-8 text-center text-sm text-muted-foreground">
                    Nenhum registro encontrado para os filtros selecionados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
