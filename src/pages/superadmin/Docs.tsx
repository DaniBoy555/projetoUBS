import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';

export default function SuperAdminDocs() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Documentação do Sistema</h2>
                <p className="text-muted-foreground">Guias, Manuais e Referência Técnica.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card className="col-span-full lg:col-span-1">
                    <CardHeader>
                        <CardTitle>Navegação</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <nav className="space-y-2 text-sm">
                            <a href="#" className="block p-2 hover:bg-slate-100 rounded">Visão Geral</a>
                            <a href="#" className="block p-2 hover:bg-slate-100 rounded">Gestão de Usuários</a>
                            <a href="#" className="block p-2 hover:bg-slate-100 rounded">Integração PEC/CDS</a>
                            <a href="#" className="block p-2 hover:bg-slate-100 rounded">Relatórios Avançados</a>
                        </nav>
                    </CardContent>
                </Card>

                <Card className="col-span-full lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Conteúdo</CardTitle>
                        <CardDescription>Selecione um tópico ao lado.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                            <h3 className="font-semibold text-lg mb-4">Bem-vindo à Documentação Oficial Nexx Saúde</h3>
                            <p className="mb-4">
                                Este painel fornece acesso rápido a todos os manuais administrativos e técnicos do sistema Multi-OBS.
                                Aqui você encontrará detalhes sobre como configurar novas unidades, gerenciar permissões de acesso e visualizar logs de auditoria.
                            </p>
                            <h4 className="font-medium mb-2">Estrutura de Permissões</h4>
                            <ul className="list-disc pl-5 space-y-1 mb-4">
                                <li><strong>SuperAdmin:</strong> Acesso irrestrito a todas as configurações globais.</li>
                                <li><strong>Admin OBS:</strong> Gestão de uma unidade específica (agentes e eventos).</li>
                                <li><strong>Agente de Saúde:</strong> Operação diária, visitas e triagem.</li>
                            </ul>
                        </ScrollArea>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
