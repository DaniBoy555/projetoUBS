# 💻 EXEMPLOS DE CÓDIGO - Multi-OBS Saúde

Este arquivo contém exemplos de código prontos para acelerar o desenvolvimento.

---

## 🔧 CONFIGURAÇÃO INICIAL

### 1. Configuração Supabase (`src/lib/supabase.ts`)

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types
export type TipoUsuario = 'superadmin' | 'admin_obs' | 'agente_saude' | 'populacao';
export type StatusUsuario = 'ativo' | 'inativo';
export type TipoEvento = 'vacina' | 'campanha' | 'palestra' | 'exame' | 'atendimento';

export interface Usuario {
  id: string;
  auth_id: string;
  obs_id: string | null;
  nome: string;
  email: string;
  telefone: string | null;
  tipo_usuario: TipoUsuario;
  posto_saude: string | null;
  foto_url: string | null;
  status: StatusUsuario;
  created_at: string;
  updated_at: string;
}

export interface OBS {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
  cnpj: string | null;
  telefone: string | null;
  email: string | null;
  dominio: string | null;
  webhook_whatsapp: string | null;
  logo_url: string | null;
  status: 'ativo' | 'inativo' | 'suspenso';
  plano: 'basico' | 'premium' | 'enterprise';
  created_at: string;
  updated_at: string;
}

export interface EventoSaude {
  id: string;
  obs_id: string;
  tipo: TipoEvento;
  titulo: string;
  descricao: string | null;
  data_inicio: string;
  data_fim: string | null;
  horario_inicio: string | null;
  horario_fim: string | null;
  posto_saude: string | null;
  endereco: string | null;
  profissional_responsavel: string | null;
  vagas_total: number | null;
  vagas_ocupadas: number;
  publico_alvo: string | null;
  status: 'ativo' | 'cancelado' | 'concluido';
  criado_por: string;
  created_at: string;
  updated_at: string;
}
```

### 2. Variáveis de Ambiente (`.env`)

```env
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anonima-aqui
```

---

## 🔐 AUTENTICAÇÃO

### Hook useAuth (`src/hooks/useAuth.ts`)

```typescript
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase, Usuario } from '@/lib/supabase';
import { toast } from '@/hooks/use-toast';

export function useAuth() {
  const [user, setUser] = useState<Usuario | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar sessão existente
    checkUser();

    // Listener de mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserData(session.user.id);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        await loadUserData(session.user.id);
      }
    } catch (error) {
      console.error('Error checking user:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUserData = async (authId: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('auth_id', authId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error loading user data:', error);
      setUser(null);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        await loadUserData(data.user.id);
        toast({
          title: 'Login realizado com sucesso!',
          description: 'Redirecionando...',
        });
        
        // Redirect baseado no tipo de usuário
        redirectByUserType();
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer login',
        description: error.message,
      });
      throw error;
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    userData: Partial<Usuario>
  ) => {
    try {
      // 1. Criar usuário no auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Criar registro na tabela usuarios
      const { error: insertError } = await supabase
        .from('usuarios')
        .insert({
          auth_id: authData.user.id,
          email,
          ...userData,
        });

      if (insertError) throw insertError;

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Faça login para continuar.',
      });

      navigate('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar conta',
        description: error.message,
      });
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setUser(null);
      navigate('/login');
      
      toast({
        title: 'Logout realizado',
        description: 'Até logo!',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao fazer logout',
        description: error.message,
      });
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      toast({
        title: 'Email enviado!',
        description: 'Verifique sua caixa de entrada para redefinir a senha.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao enviar email',
        description: error.message,
      });
      throw error;
    }
  };

  const redirectByUserType = () => {
    if (!user) return;

    switch (user.tipo_usuario) {
      case 'superadmin':
        navigate('/superadmin');
        break;
      case 'admin_obs':
        navigate('/admin');
        break;
      case 'agente_saude':
        navigate('/agente');
        break;
      case 'populacao':
        navigate('/');
        break;
      default:
        navigate('/');
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
}
```

### Componente ProtectedRoute (`src/components/ProtectedRoute.tsx`)

```typescript
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { TipoUsuario } from '@/lib/supabase';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: TipoUsuario[];
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.tipo_usuario)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
```

---

## 📱 LAYOUT

### Layout Principal (`src/components/layout/Layout.tsx`)

```typescript
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { Footer } from './Footer';

export function Layout() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar />
        
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
```

### Header (`src/components/layout/Header.tsx`)

```typescript
import { Bell, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/hooks/useAuth';

export function Header() {
  const { user, signOut } = useAuth();

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>

        <div className="flex items-center gap-2 font-bold text-xl">
          <img src="/logo.svg" alt="Logo" className="h-8 w-8" />
          <span>Multi-OBS Saúde</span>
        </div>

        <div className="ml-auto flex items-center gap-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                {user?.foto_url ? (
                  <img 
                    src={user.foto_url} 
                    alt={user.nome} 
                    className="h-8 w-8 rounded-full"
                  />
                ) : (
                  <User className="h-5 w-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{user?.nome}</p>
                  <p className="text-xs text-muted-foreground">{user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Perfil</DropdownMenuItem>
              <DropdownMenuItem>Configurações</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
```

---

## 📊 DASHBOARD

### Card de Estatística (`src/components/dashboard/StatCard.tsx`)

```typescript
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

export function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  description,
  trend 
}: StatCardProps) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">
            {description}
          </p>
        )}
        {trend && (
          <div className={`text-xs mt-2 ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}% em relação ao mês anterior
          </div>
        )}
      </CardContent>
    </Card>
  );
}
```

---

## 📝 FORMULÁRIOS

### Formulário de Evento (`src/components/forms/FormEvento.tsx`)

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { supabase, TipoEvento } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

const eventoSchema = z.object({
  tipo: z.enum(['vacina', 'campanha', 'palestra', 'exame', 'atendimento']),
  titulo: z.string().min(3, 'Título deve ter pelo menos 3 caracteres'),
  descricao: z.string().optional(),
  data_inicio: z.string(),
  data_fim: z.string().optional(),
  horario_inicio: z.string().optional(),
  horario_fim: z.string().optional(),
  posto_saude: z.string().optional(),
  endereco: z.string().optional(),
  profissional_responsavel: z.string().optional(),
  vagas_total: z.number().optional(),
  publico_alvo: z.string().optional(),
});

type EventoFormData = z.infer<typeof eventoSchema>;

export function FormEvento({ onSuccess }: { onSuccess?: () => void }) {
  const { user } = useAuth();
  
  const form = useForm<EventoFormData>({
    resolver: zodResolver(eventoSchema),
    defaultValues: {
      tipo: 'vacina',
      vagas_total: 50,
    },
  });

  const onSubmit = async (data: EventoFormData) => {
    if (!user?.obs_id) {
      toast({
        variant: 'destructive',
        title: 'Erro',
        description: 'Usuário não vinculado a uma OBS',
      });
      return;
    }

    try {
      const { error } = await supabase
        .from('eventos_saude')
        .insert({
          ...data,
          obs_id: user.obs_id,
          criado_por: user.id,
          vagas_ocupadas: 0,
          status: 'ativo',
        });

      if (error) throw error;

      toast({
        title: 'Evento criado!',
        description: 'O evento foi cadastrado com sucesso.',
      });

      form.reset();
      onSuccess?.();
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Erro ao criar evento',
        description: error.message,
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Evento</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="vacina">Vacinação</SelectItem>
                  <SelectItem value="campanha">Campanha</SelectItem>
                  <SelectItem value="palestra">Palestra</SelectItem>
                  <SelectItem value="exame">Exame</SelectItem>
                  <SelectItem value="atendimento">Atendimento</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título do Evento</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Vacinação contra Gripe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="descricao"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Descreva os detalhes do evento..."
                  className="resize-none"
                  rows={4}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="data_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Início</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="data_fim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Data de Término (Opcional)</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="horario_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Início</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="horario_fim"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horário de Término</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="posto_saude"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Posto de Saúde</FormLabel>
              <FormControl>
                <Input placeholder="Ex: UBS Centro" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="profissional_responsavel"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profissional Responsável</FormLabel>
              <FormControl>
                <Input placeholder="Ex: Dra. Maria Silva" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="vagas_total"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total de Vagas</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Deixe em branco se não houver limite de vagas
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Criar Evento
        </Button>
      </form>
    </Form>
  );
}
```

---

## 📅 CALENDÁRIO

### Componente de Calendário de Eventos (`src/components/CalendarioEventos.tsx`)

```typescript
import { useEffect, useState } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { supabase, EventoSaude } from '@/lib/supabase';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function CalendarioEventos({ obsId }: { obsId?: string }) {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [eventos, setEventos] = useState<EventoSaude[]>([]);
  const [eventosDoMes, setEventosDoMes] = useState<Date[]>([]);

  useEffect(() => {
    if (date) {
      carregarEventos();
      carregarEventosDoMes();
    }
  }, [date, obsId]);

  const carregarEventos = async () => {
    if (!date) return;

    const dataFormatada = format(date, 'yyyy-MM-dd');
    
    let query = supabase
      .from('eventos_saude')
      .select('*')
      .eq('data_inicio', dataFormatada)
      .eq('status', 'ativo');

    if (obsId) {
      query = query.eq('obs_id', obsId);
    }

    const { data, error } = await query;

    if (!error && data) {
      setEventos(data);
    }
  };

  const carregarEventosDoMes = async () => {
    if (!date) return;

    const inicioMes = format(new Date(date.getFullYear(), date.getMonth(), 1), 'yyyy-MM-dd');
    const fimMes = format(new Date(date.getFullYear(), date.getMonth() + 1, 0), 'yyyy-MM-dd');

    let query = supabase
      .from('eventos_saude')
      .select('data_inicio')
      .gte('data_inicio', inicioMes)
      .lte('data_inicio', fimMes)
      .eq('status', 'ativo');

    if (obsId) {
      query = query.eq('obs_id', obsId);
    }

    const { data, error } = await query;

    if (!error && data) {
      const datas = data.map(e => new Date(e.data_inicio));
      setEventosDoMes(datas);
    }
  };

  const getTipoBadgeColor = (tipo: string) => {
    const colors: Record<string, string> = {
      vacina: 'bg-blue-500',
      campanha: 'bg-green-500',
      palestra: 'bg-purple-500',
      exame: 'bg-orange-500',
      atendimento: 'bg-pink-500',
    };
    return colors[tipo] || 'bg-gray-500';
  };

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Calendário</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            locale={ptBR}
            modifiers={{
              hasEvent: eventosDoMes,
            }}
            modifiersStyles={{
              hasEvent: {
                fontWeight: 'bold',
                backgroundColor: 'hsl(var(--primary))',
                color: 'white',
                borderRadius: '50%',
              },
            }}
            className="rounded-md border"
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Eventos do dia {date && format(date, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {eventos.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              Nenhum evento cadastrado para esta data
            </p>
          ) : (
            <div className="space-y-4">
              {eventos.map((evento) => (
                <div
                  key={evento.id}
                  className="border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <h4 className="font-semibold">{evento.titulo}</h4>
                      <p className="text-sm text-muted-foreground">
                        {evento.descricao}
                      </p>
                      {evento.posto_saude && (
                        <p className="text-sm">📍 {evento.posto_saude}</p>
                      )}
                      {evento.horario_inicio && (
                        <p className="text-sm">🕐 {evento.horario_inicio}</p>
                      )}
                    </div>
                    <Badge className={getTipoBadgeColor(evento.tipo)}>
                      {evento.tipo}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
```

---

## 🔌 WEBHOOK HANDLER

### API Route Handler (exemplo usando Supabase Edge Functions)

```typescript
// supabase/functions/webhook-eventos/index.ts

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Validar API Key
    const apiKey = req.headers.get('x-api-key');
    if (!apiKey || apiKey !== Deno.env.get('WEBHOOK_API_KEY')) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Extrair obs_id da URL
    const url = new URL(req.url);
    const pathParts = url.pathname.split('/');
    const obsId = pathParts[pathParts.indexOf('obs') + 1];

    if (!obsId) {
      return new Response(
        JSON.stringify({ error: 'OBS ID é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Parse do payload
    const payload = await req.json();

    // Validar campos obrigatórios
    if (!payload.tipo || !payload.titulo || !payload.data_inicio) {
      return new Response(
        JSON.stringify({ error: 'Campos obrigatórios: tipo, titulo, data_inicio' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Inserir evento
    const { data, error } = await supabase
      .from('eventos_saude')
      .insert({
        obs_id: obsId,
        ...payload,
        status: 'ativo',
        vagas_ocupadas: 0,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Evento criado com sucesso',
        data 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
```

---

## 🧪 TESTES

### Exemplo de Teste Unitário (Vitest)

```typescript
// src/__tests__/useAuth.test.ts

import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useAuth } from '@/hooks/useAuth';

// Mock Supabase
vi.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      getSession: vi.fn(),
      onAuthStateChange: vi.fn(() => ({
        data: { subscription: { unsubscribe: vi.fn() } }
      })),
      signInWithPassword: vi.fn(),
      signOut: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  },
}));

describe('useAuth', () => {
  it('deve inicializar com loading true', () => {
    const { result } = renderHook(() => useAuth());
    expect(result.current.loading).toBe(true);
  });

  it('deve fazer login com sucesso', async () => {
    const { result } = renderHook(() => useAuth());
    
    await waitFor(() => {
      result.current.signIn('test@example.com', 'password123');
    });

    expect(result.current.user).toBeDefined();
  });
});
```

---

## 📚 RECURSOS ADICIONAIS

### Package.json Scripts Úteis

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "format": "prettier --write \"src/**/*.{ts,tsx}\"",
    "supabase:gen-types": "supabase gen types typescript --project-id YOUR_PROJECT_ID > src/types/database.ts"
  }
}
```

---

**Nota**: Adapte estes exemplos conforme necessário para seu projeto específico. Use-os como ponto de partida e expanda conforme suas necessidades.
