import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { mockOBS } from '@/lib/mock-data';
import { Search, Plus, Pencil, Power, PowerOff } from 'lucide-react';
import type { OBS } from '@/types';

export default function OBSManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [obs, setObs] = useState<OBS[]>(mockOBS);

  const filteredOBS = obs.filter(
    (item) =>
      item.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cidade.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.estado.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleStatus = (id: string) => {
    setObs((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: item.status === 'ativo' ? 'inativo' : 'ativo',
            }
          : item
      )
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Gestão de OBS</h1>
          <p className="text-muted-foreground">
            Gerencie todas as Organizações de Saúde cadastradas
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova OBS
        </Button>
      </div>

      {/* Barra de busca */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar OBS</CardTitle>
          <CardDescription>
            Busque por nome, cidade ou estado
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar OBS..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
        </CardContent>
      </Card>

      {/* Tabela de OBS */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de OBS ({filteredOBS.length})</CardTitle>
          <CardDescription>
            Total de {obs.length} OBS cadastradas no sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Cidade/Estado</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Plano</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOBS.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-muted-foreground">
                    Nenhuma OBS encontrada
                  </TableCell>
                </TableRow>
              ) : (
                filteredOBS.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nome}</TableCell>
                    <TableCell>
                      {item.cidade}, {item.estado}
                    </TableCell>
                    <TableCell>{item.email}</TableCell>
                    <TableCell>{item.telefone}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.plano === 'enterprise'
                            ? 'default'
                            : item.plano === 'premium'
                            ? 'secondary'
                            : 'outline'
                        }
                      >
                        {item.plano}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          item.status === 'ativo'
                            ? 'default'
                            : item.status === 'inativo'
                            ? 'secondary'
                            : 'destructive'
                        }
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleToggleStatus(item.id)}
                        >
                          {item.status === 'ativo' ? (
                            <PowerOff className="h-4 w-4 text-red-500" />
                          ) : (
                            <Power className="h-4 w-4 text-green-500" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Estatísticas */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OBS Ativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {obs.filter((item) => item.status === 'ativo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((obs.filter((item) => item.status === 'ativo').length / obs.length) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OBS Inativas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {obs.filter((item) => item.status === 'inativo').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((obs.filter((item) => item.status === 'inativo').length / obs.length) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">OBS Suspensas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {obs.filter((item) => item.status === 'suspenso').length}
            </div>
            <p className="text-xs text-muted-foreground">
              {((obs.filter((item) => item.status === 'suspenso').length / obs.length) * 100).toFixed(1)}% do total
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
