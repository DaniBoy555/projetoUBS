import { useState, useEffect } from 'react';
import { ArrowLeft, UserPlus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

export default function AdminOBSAgentes() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [agentes, setAgentes] = useState<any[]>([]);

    useEffect(() => {
        if (user?.obs_id) {
            loadAgentes();
        }
    }, [user?.obs_id]);

    const loadAgentes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('usuarios')
                .select('*')
                .eq('obs_id', user?.obs_id)
                .eq('tipo_usuario', 'agente_saude');

            if (error) throw error;
            setAgentes(data || []);
        } catch (error) {
            console.error('Erro ao carregar agentes:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6 space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Button variant="ghost" size="icon" onClick={() => navigate('/admin')}>
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Gestão de Agentes de Saúde</h1>
                        <p className="text-sm text-gray-500">Listagem e controle da equipe</p>
                    </div>
                </div>
                <Button>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Novo Agente
                </Button>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Equipe ({agentes.length})</CardTitle>
                    <div className="relative w-64">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input placeholder="Buscar agente..." className="pl-8" />
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nome</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Ações</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">Carregando...</TableCell>
                                    </TableRow>
                                ) : agentes.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center h-24">Nenhum agente encontrado.</TableCell>
                                    </TableRow>
                                ) : (
                                    agentes.map((agente) => (
                                        <TableRow key={agente.id}>
                                            <TableCell className="font-medium">{agente.nome}</TableCell>
                                            <TableCell>{agente.email}</TableCell>
                                            <TableCell>
                                                <Badge variant={agente.status === 'ativo' ? 'default' : 'secondary'}>
                                                    {agente.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button variant="ghost" size="sm">Editar</Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
