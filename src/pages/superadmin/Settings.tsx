import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function SuperAdminSettings() {
    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Configurações do Sistema</h2>
                <p className="text-muted-foreground">Gerencie as configurações globais da plataforma.</p>
            </div>

            <Tabs defaultValue="geral" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="geral">Geral</TabsTrigger>
                    <TabsTrigger value="seguranca">Segurança</TabsTrigger>
                    <TabsTrigger value="api">API e Integrações</TabsTrigger>
                </TabsList>
                <TabsContent value="geral" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Identidade Visual</CardTitle>
                            <CardDescription>Personalize o nome e logo do sistema.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="system-name">Nome do Sistema</Label>
                                <Input id="system-name" defaultValue="Multi-OBS Saúde" />
                            </div>
                            <Button>Salvar Alterações</Button>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="seguranca">
                    <Card>
                        <CardHeader>
                            <CardTitle>Políticas de Acesso</CardTitle>
                            <CardDescription>Configure regras de senha e sessão.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Configurações de MFA e tempo de sessão.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="api">
                    <Card>
                        <CardHeader>
                            <CardTitle>Chaves de API</CardTitle>
                            <CardDescription>Gerencie o acesso de terceiros.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">Configurações de integração com PEC e CDS.</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
