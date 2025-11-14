import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { HeartHandshake, Users, Calendar, Building2, AlertCircle, Bug } from 'lucide-react';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from '@/hooks/useAuth';
import { isSupabaseConfigured } from '@/lib/supabase';
import { debugSupabase } from '@/utils/debugSupabase';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  userType: z.string().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<string>('superadmin');
  const [forceDemo, setForceDemo] = useState(false);
  const { signIn } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await signIn(data.email, data.password, selectedUserType, forceDemo);
    } catch (error) {
      // Error is already handled in useAuth hook
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setForceDemo(true);
    onSubmit({ email: 'demo@test.com', password: '123456', userType: selectedUserType });
  };

  const handleDebug = async () => {
    console.log('🩺 Executando diagnóstico completo...');
    await debugSupabase.runFullDiagnosis();
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-800 mb-3">
            <AlertCircle className="h-4 w-4" />
            <p className="text-sm font-medium">
              Modo Demonstração - Use qualquer email e senha para entrar
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="userType" className="text-sm text-amber-700">
              Testar como:
            </Label>
            <Select value={selectedUserType} onValueChange={setSelectedUserType}>
              <SelectTrigger className="bg-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="superadmin">SuperAdmin (vê tudo)</SelectItem>
                <SelectItem value="admin_obs">Admin OBS (gestão da OBS)</SelectItem>
                <SelectItem value="agente_saude">Agente de Saúde (operacional)</SelectItem>
                <SelectItem value="populacao">População (público)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
      
      <Card className="overflow-hidden">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
            <div className="flex flex-col gap-6">
              <div className="flex flex-col items-center text-center">
                <div className="flex items-center gap-2 mb-4">
                  <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center">
                    <HeartHandshake className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-blue-600">Multi-OBS</h2>
                </div>
                <h1 className="text-2xl font-bold">Bem-vindo de volta</h1>
                <p className="text-balance text-muted-foreground">
                  Acesse o sistema de gestão de saúde pública
                </p>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  {...register('email')}
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  disabled={isLoading}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Senha</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Esqueceu sua senha?
                  </a>
                </div>
                <Input 
                  {...register('password')}
                  id="password" 
                  type="password" 
                  disabled={isLoading}
                />
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password.message}</p>
                )}
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Entrando...' : 'Entrar'}
              </Button>

              {isSupabaseConfigured && (
                <Button 
                  type="button" 
                  variant="outline" 
                  className="w-full" 
                  onClick={handleDemoLogin}
                  disabled={isLoading}
                >
                  🧪 Modo Demo (Debug)
                </Button>
              )}

              <Button 
                type="button" 
                variant="secondary" 
                size="sm"
                className="w-full text-xs" 
                onClick={handleDebug}
                disabled={isLoading}
              >
                <Bug className="h-3 w-3 mr-1" />
                Diagnóstico Supabase (veja o console)
              </Button>

              <div className="text-center text-sm">
                Primeiro acesso?{" "}
                <a href="#" className="underline underline-offset-4 font-medium text-primary">
                  Entre em contato com seu administrador
                </a>
              </div>
            </div>
          </form>
          
          <div className="relative hidden bg-gradient-to-br from-blue-600 to-blue-800 md:block">
            <div className="absolute inset-0 flex flex-col justify-center p-8 text-white">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold">
                  Sistema Multi-OBS
                </h2>
                <p className="text-blue-100">
                  Conectando e integrando Organizações Básicas de Saúde em todo o Brasil
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Building2 className="h-5 w-5" />
                    <span className="text-sm">Gestão de múltiplas OBS</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5" />
                    <span className="text-sm">Controle de usuários e permissões</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5" />
                    <span className="text-sm">Agendamento de eventos de saúde</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <HeartHandshake className="h-5 w-5" />
                    <span className="text-sm">Atendimento à população</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-balance text-center text-xs text-muted-foreground">
        <p>© 2025 Sistema Multi-OBS de Gestão de Saúde Pública</p>
        <p className="mt-1">Desenvolvido por Nexxia para Unidades Básicas de Saúde do Brasil</p>
      </div>
    </div>
  )
}
