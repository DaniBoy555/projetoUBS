import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, MapPin, Calendar, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

export default function AdminOBSEventos() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [eventos, setEventos] = useState<any[]>([]);

    useEffect(() => {
        if (user?.obs_id) {
            loadEventos();
        }
    }, [user?.obs_id]);

    const loadEventos = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('eventos_saude')
                .select('*')
                .eq('obs_id', user?.obs_id)
                .order('data_inicio', { ascending: false });

            if (error) throw error;
            setEventos(data || []);
        } catch (error) {
            console.error('Erro ao carregar eventos:', error);
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
                        <h1 className="text-2xl font-bold text-gray-900">Eventos e Campanhas</h1>
                        <p className="text-sm text-gray-500">Gestão de ações de saúde da OBS</p>
                    </div>
                </div>
                <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Novo Evento
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-center col-span-full py-10">Carregando eventos...</p>
                ) : eventos.length === 0 ? (
                    <Card className="col-span-full flex flex-col items-center justify-center py-16 border-dashed">
                        <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-medium">Nenhum evento criado</h3>
                        <p className="text-muted-foreground mb-4">Comece criando um evento ou campanha para sua população.</p>
                        <Button variant="outline">Criar Primeiro Evento</Button>
                    </Card>
                ) : (
                    eventos.map((evento) => (
                        <Card key={evento.id} className="hover:shadow-md transition-shadow">
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <Badge variant={evento.status === 'ativo' ? 'default' : 'secondary'}>
                                        {evento.status}
                                    </Badge>
                                    {/* Menu de ações futura aqui */}
                                </div>
                                <CardTitle className="line-clamp-1 mt-2">{evento.titulo}</CardTitle>
                                <CardDescription className="line-clamp-2">{evento.descricao}</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    {new Date(evento.data_inicio).toLocaleDateString('pt-BR')}
                                </div>
                                <div className="flex items-center">
                                    <MapPin className="h-4 w-4 mr-2" />
                                    {evento.localizacao || 'OBS Local'}
                                </div>
                                <div className="flex items-center">
                                    <Users className="h-4 w-4 mr-2" />
                                    {evento.publico_alvo || 'Geral'}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
