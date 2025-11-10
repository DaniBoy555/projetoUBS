// Tipos de usuário do sistema
export type TipoUsuario = 'superadmin' | 'admin_obs' | 'agente_saude' | 'populacao';
export type StatusUsuario = 'ativo' | 'inativo';
export type StatusOBS = 'ativo' | 'inativo' | 'suspenso';
export type PlanoOBS = 'basico' | 'premium' | 'enterprise';
export type TipoEvento = 'vacina' | 'campanha' | 'palestra' | 'exame' | 'atendimento';

// Interface de OBS
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

// Interface de Usuário
export interface Usuario {
  id: string;
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

// Interface de Evento de Saúde
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

// Interface de Médico Disponível
export interface MedicoDisponivel {
  id: string;
  obs_id: string;
  nome: string;
  especialidade: string;
  posto_saude: string;
  data: string;
  horario_inicio: string;
  horario_fim: string;
  created_at: string;
  updated_at: string;
}

// Interface de Dúvida da População
export interface DuvidaPopulacao {
  id: string;
  obs_id: string;
  nome_pessoa: string;
  numero_whatsapp: string;
  pergunta: string;
  resposta: string | null;
  data_pergunta: string;
  data_resposta: string | null;
  status: 'pendente' | 'respondida' | 'arquivada';
  created_at: string;
  updated_at: string;
}

// Interface de Log de Auditoria
export interface LogAuditoria {
  id: string;
  obs_id: string | null;
  usuario_id: string;
  usuario_nome: string;
  acao: string;
  descricao: string;
  ip_address: string | null;
  created_at: string;
}

// Estatísticas do Dashboard
export interface DashboardStats {
  totalOBS: number;
  totalUsuarios: number;
  totalEventos: number;
  totalAgentes: number;
  obsAtivas: number;
  obsInativas: number;
  eventosHoje: number;
  duvidasPendentes: number;
}
