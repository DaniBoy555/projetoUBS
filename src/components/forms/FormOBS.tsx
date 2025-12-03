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
const obsSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  cidade: z.string().min(2, 'Cidade é obrigatória'),
  estado: z.string().length(2, 'Use a sigla do estado (ex: SP)'),
  status: z.enum(['ativo', 'inativo', 'suspenso']),
  plano: z.enum(['basico', 'premium', 'enterprise']),
});

type OBSFormValues = z.infer<typeof obsSchema>;

interface FormOBSProps {
  initialData?: OBSFormValues & { id?: string };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function FormOBS({ initialData, onSuccess, onCancel }: FormOBSProps) {
  const form = useForm<OBSFormValues>({
    resolver: zodResolver(obsSchema),
    defaultValues: initialData || {
      nome: '',
      cidade: '',
      estado: '',
      status: 'ativo',
      plano: 'basico',
    },
  });

  const onSubmit = async (data: OBSFormValues) => {
    try {
      // Se tiver ID, é edição
      if (initialData?.id) {
        const { error } = await supabase
          .from('obs')
          .update(data)
          .eq('id', initialData.id);

        if (error) throw error;
        toast.success('OBS atualizada com sucesso!');
      } else {
        // Criação
        const { error } = await supabase
          .from('obs')
          .insert(data);

        if (error) throw error;
        toast.success('OBS criada com sucesso!');
      }

      onSuccess?.();
    } catch (error: any) {
      console.error('Erro ao salvar OBS:', error);
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
              <FormLabel>Nome da OBS</FormLabel>
              <FormControl>
                <Input placeholder="Ex: UBS Central" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="cidade"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cidade</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: São Paulo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="estado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estado (UF)</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: SP" maxLength={2} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ativo">Ativo</SelectItem>
                    <SelectItem value="inativo">Inativo</SelectItem>
                    <SelectItem value="suspenso">Suspenso</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plano"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Plano</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o plano" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
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
            {initialData?.id ? 'Salvar Alterações' : 'Criar OBS'}
          </Button>
        </div>
      </form>
    </Form>
  );
}