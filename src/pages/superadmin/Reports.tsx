import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function SuperAdminReports() {
    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Fev', value: 300 },
        { name: 'Mar', value: 200 },
        { name: 'Abr', value: 278 },
        { name: 'Mai', value: 189 },
        { name: 'Jun', value: 239 },
    ];

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Relatórios Gerenciais</h2>
                <p className="text-muted-foreground">Visão geral do sistema e métricas de desempenho.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Engajamento Total</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={data}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" />
                                    <YAxis />
                                    <Tooltip />
                                    <Bar dataKey="value" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
                {/* Placeholder for more charts */}
            </div>
        </div>
    );
}
