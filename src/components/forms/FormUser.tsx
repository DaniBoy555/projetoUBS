import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase';

// Esquema de validação Zod
const userSchema = z.object({
    nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres').optional().or(z.literal('')),
    tipo_usuario: z.enum(['superadmin', 'admin_obs', 'agente_saude', 'populacao']),
    obs_id: z.string().optional(), // Opcional pois superadmin pode não ter OBS
});

type UserFormValues = z.infer<typeof userSchema>;

interface FormUserProps {
    initialData?: UserFormValues & { id?: string };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export function FormUser({ initialData, onSuccess, onCancel }: FormUserProps) {
    const form = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: initialData || {
            nome: '',
            email: '',
            password: '',
            tipo_usuario: 'populacao',
        },
    });

    const onSubmit = async (data: UserFormValues) => {
        try {
            if (initialData?.id) {
                // Edição (apenas dados públicos por enquanto)
                const { error } = await supabase
                    .from('usuarios')
                    .update({
                        nome: data.nome,
                        tipo_usuario: data.tipo_usuario,
                        obs_id: data.obs_id || null,
                    })
                    .eq('id', initialData.id);

                if (error) throw error;
                toast.success('Usuário atualizado com sucesso!');
            } else {
                // Criação (requer Auth + Tabela Pública)
                if (!data.password) {
                    toast.error('Senha é obrigatória para novos usuários');
                    return;
                }

                // 1. Criar no Auth
                const { data: authData, error: authError } = await supabase.auth.signUp({
                    email: data.email,
                    password: data.password,
                });

                if (authError) throw authError;
                if (!authData.user) throw new Error('Erro ao criar usuário no Auth');

                // 2. Criar na tabela usuarios
                const { error: insertError } = await supabase
                    .from('usuarios')
                    .insert({
                        auth_id: authData.user.id,
                        email: data.email,
                        nome: data.nome,
                        tipo_usuario: data.tipo_usuario,
                        obs_id: data.obs_id || null,
                        status: 'ativo'
                    });

                if (insertError) throw insertError;
                toast.success('Usuário criado com sucesso!');
            }

            onSuccess?.();
        } catch (error: any) {
            console.error('Erro ao salvar usuário:', error);
            toast.error(`Erro ao salvar: ${error.message}`);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="nome"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: João Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: joao@email.com" {...field} disabled={!!initialData?.id} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {!initialData?.id && (
                    <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Senha</FormLabel>
                                <FormControl>
                                    <Input type="password" placeholder="******" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="tipo_usuario"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tipo de Usuário</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione o tipo" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="superadmin">Super Admin</SelectItem>
                                        <SelectItem value="admin_obs">Admin OBS</SelectItem>
                                        <SelectItem value="agente_saude">Agente de Saúde</SelectItem>
                                        <SelectItem value="populacao">População</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Aqui poderia ter um Select de OBS se tivéssemos a lista carregada */}
                    <FormField
                        control={form.control}
                        name="obs_id"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>ID da OBS (Opcional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="UUID da OBS" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancelar
                    </Button>
                    <Button type="submit">
                        {initialData?.id ? 'Salvar Alterações' : 'Criar Usuário'}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
