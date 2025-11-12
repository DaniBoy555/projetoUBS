import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key';

// Para desenvolvimento, usamos valores placeholder se as credenciais reais não estiverem configuradas
const isPlaceholder = supabaseUrl.includes('placeholder') || supabaseAnonKey.includes('placeholder');

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Flag para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = !isPlaceholder;

// Types
export type TipoUsuario = 'superadmin' | 'admin_obs' | 'agente_saude' | 'populacao';
export type StatusUsuario = 'ativo' | 'inativo';
export type TipoEvento = 'vacina' | 'campanha' | 'palestra' | 'exame' | 'atendimento';
export type StatusOBS = 'ativo' | 'inativo' | 'suspenso';
export type PlanoOBS = 'basico' | 'premium' | 'enterprise';
export type StatusEvento = 'ativo' | 'cancelado' | 'concluido';

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
  status: StatusOBS;
  plano: PlanoOBS;
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
  status: StatusEvento;
  criado_por: string;
  created_at: string;
  updated_at: string;
}

export interface MedicoDisponivel {
  id: string;
  obs_id: string;
  nome: string;
  crm: string | null;
  especialidade: string;
  posto_saude: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  vagas_total: number;
  vagas_ocupadas: number;
  status: 'ativo' | 'cancelado';
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DuvidaPopulacao {
  id: string;
  obs_id: string;
  nome_pessoa: string;
  email: string | null;
  numero_whatsapp: string | null;
  categoria: 'vacina' | 'atendimento' | 'medicamento' | 'outro' | null;
  pergunta: string;
  resposta: string | null;
  status: 'pendente' | 'respondida' | 'arquivada';
  respondido_por: string | null;
  data_pergunta: string;
  data_resposta: string | null;
  created_at: string;
}

export interface LogAuditoria {
  id: string;
  obs_id: string | null;
  usuario_id: string | null;
  acao: string;
  tabela: string;
  registro_id: string | null;
  dados_anteriores: any;
  dados_novos: any;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}