# 🏥 Sistema Multi-OBS de Saúde - Prompt para Claude Code

## 📋 O QUE FALTAVA NO PROMPT ORIGINAL

### Aspectos Técnicos Não Especificados:
- [ ] Stack tecnológico específico (React/Vite, TypeScript, etc.)
- [ ] Biblioteca de componentes UI (shadcn/ui, etc.)
- [ ] Estrutura de pastas e arquitetura do projeto
- [ ] Sistema de rotas e navegação
- [ ] Gerenciamento de estado (Context API, Zustand, etc.)
- [ ] Validação de formulários (Zod, React Hook Form)
- [ ] Tratamento de erros e loading states
- [ ] Políticas RLS (Row Level Security) detalhadas
- [ ] Sistema de notificações/alertas
- [ ] Upload de arquivos/imagens
- [ ] Logs e auditoria
- [ ] Testes automatizados

### Funcionalidades Não Detalhadas:
- [ ] Fluxo de onboarding de nova OBS
- [ ] Reset de senha e recuperação de conta
- [ ] Notificações em tempo real
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Sistema de busca avançada
- [ ] Dashboard com gráficos e métricas
- [ ] Histórico de alterações
- [ ] Configurações de perfil
- [ ] Dark mode
- [ ] Responsividade mobile

---

## 🎯 PROMPT COMPLETO PARA CLAUDE CODE

### Contexto do Projeto
Você está desenvolvendo um **sistema SaaS multi-tenant** para gestão de informações de saúde pública no Brasil. O sistema será usado por múltiplas OBS (Organizações Básicas de Saúde) de diferentes municípios.

### Stack Tecnológico
```
Frontend:
- Vite + React 18 + TypeScript
- Tailwind CSS
- shadcn/ui (componentes)
- Lucide React (ícones)
- React Router DOM v6
- React Hook Form + Zod
- TanStack Query (react-query)
- Zustand (estado global)
- date-fns (datas)
- recharts (gráficos)

Backend/Database:
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Realtime subscriptions
- Storage para uploads

Integrações:
- n8n webhooks
- WhatsApp Business API (futuro)
```

---

## 🗂️ ESTRUTURA DO PROJETO

```
src/
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── layout/          # Header, Sidebar, Footer
│   ├── dashboard/       # Cards, Stats, Charts
│   ├── forms/           # Form components
│   └── shared/          # Componentes reutilizáveis
├── pages/
│   ├── auth/           # Login, Register, Reset
│   ├── superadmin/     # Painel SuperAdmin
│   ├── admin-obs/      # Painel AdminOBS
│   ├── agente/         # Painel Agente
│   └── populacao/      # Portal Público
├── lib/
│   ├── supabase.ts     # Cliente Supabase
│   ├── api.ts          # Funções API
│   └── utils.ts        # Utilidades
├── hooks/              # Custom hooks
├── stores/             # Zustand stores
├── types/              # TypeScript types
├── constants/          # Constantes
└── App.tsx
```

---

## 📊 SCHEMA SUPABASE COMPLETO

### Tabela: obs
```sql
CREATE TABLE obs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nome TEXT NOT NULL,
  cidade TEXT NOT NULL,
  estado TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  telefone TEXT,
  email TEXT,
  dominio TEXT UNIQUE,
  webhook_whatsapp TEXT,
  logo_url TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo', 'suspenso')),
  plano TEXT DEFAULT 'basico' CHECK (plano IN ('basico', 'premium', 'enterprise')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: usuarios
```sql
CREATE TABLE usuarios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  obs_id UUID REFERENCES obs(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  telefone TEXT,
  tipo_usuario TEXT NOT NULL CHECK (tipo_usuario IN ('superadmin', 'admin_obs', 'agente_saude', 'populacao')),
  posto_saude TEXT,
  foto_url TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'inativo')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: eventos_saude
```sql
CREATE TABLE eventos_saude (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obs_id UUID REFERENCES obs(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT NOT NULL CHECK (tipo IN ('vacina', 'campanha', 'palestra', 'exame', 'atendimento')),
  titulo TEXT NOT NULL,
  descricao TEXT,
  data_inicio DATE NOT NULL,
  data_fim DATE,
  horario_inicio TIME,
  horario_fim TIME,
  posto_saude TEXT,
  endereco TEXT,
  profissional_responsavel TEXT,
  vagas_total INTEGER,
  vagas_ocupadas INTEGER DEFAULT 0,
  publico_alvo TEXT,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado', 'concluido')),
  criado_por UUID REFERENCES usuarios(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: medicos_disponiveis
```sql
CREATE TABLE medicos_disponiveis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obs_id UUID REFERENCES obs(id) ON DELETE CASCADE NOT NULL,
  nome TEXT NOT NULL,
  crm TEXT,
  especialidade TEXT NOT NULL,
  posto_saude TEXT NOT NULL,
  data DATE NOT NULL,
  horario_inicio TIME NOT NULL,
  horario_fim TIME NOT NULL,
  vagas_total INTEGER DEFAULT 20,
  vagas_ocupadas INTEGER DEFAULT 0,
  status TEXT DEFAULT 'ativo' CHECK (status IN ('ativo', 'cancelado')),
  observacoes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: duvidas_populacao
```sql
CREATE TABLE duvidas_populacao (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obs_id UUID REFERENCES obs(id) ON DELETE CASCADE NOT NULL,
  nome_pessoa TEXT NOT NULL,
  email TEXT,
  numero_whatsapp TEXT,
  categoria TEXT CHECK (categoria IN ('vacina', 'atendimento', 'medicamento', 'outro')),
  pergunta TEXT NOT NULL,
  resposta TEXT,
  status TEXT DEFAULT 'pendente' CHECK (status IN ('pendente', 'respondida', 'arquivada')),
  respondido_por UUID REFERENCES usuarios(id),
  data_pergunta TIMESTAMPTZ DEFAULT NOW(),
  data_resposta TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabela: logs_auditoria
```sql
CREATE TABLE logs_auditoria (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  obs_id UUID REFERENCES obs(id) ON DELETE CASCADE,
  usuario_id UUID REFERENCES usuarios(id),
  acao TEXT NOT NULL,
  tabela TEXT NOT NULL,
  registro_id UUID,
  dados_anteriores JSONB,
  dados_novos JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 🔒 ROW LEVEL SECURITY (RLS)

### Políticas para tabela obs
```sql
-- SuperAdmin vê todas as OBS
CREATE POLICY "superadmin_all_obs" ON obs
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.auth_id = auth.uid() 
      AND usuarios.tipo_usuario = 'superadmin'
    )
  );

-- Admin e Agente veem apenas sua OBS
CREATE POLICY "users_own_obs" ON obs
  FOR SELECT USING (
    id IN (
      SELECT obs_id FROM usuarios 
      WHERE auth_id = auth.uid()
    )
  );
```

### Políticas para tabela usuarios
```sql
-- SuperAdmin vê todos os usuários
CREATE POLICY "superadmin_all_users" ON usuarios
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM usuarios 
      WHERE usuarios.auth_id = auth.uid() 
      AND usuarios.tipo_usuario = 'superadmin'
    )
  );

-- Admin vê usuários da sua OBS
CREATE POLICY "admin_own_obs_users" ON usuarios
  FOR SELECT USING (
    obs_id IN (
      SELECT obs_id FROM usuarios 
      WHERE auth_id = auth.uid() 
      AND tipo_usuario IN ('admin_obs', 'superadmin')
    )
  );

-- Usuário vê apenas seu próprio perfil
CREATE POLICY "users_own_profile" ON usuarios
  FOR SELECT USING (auth_id = auth.uid());
```

### Políticas para tabela eventos_saude
```sql
-- População vê eventos ativos da OBS local
CREATE POLICY "public_view_events" ON eventos_saude
  FOR SELECT USING (status = 'ativo');

-- Agentes e Admins gerenciam eventos da sua OBS
CREATE POLICY "staff_manage_events" ON eventos_saude
  FOR ALL USING (
    obs_id IN (
      SELECT obs_id FROM usuarios 
      WHERE auth_id = auth.uid() 
      AND tipo_usuario IN ('admin_obs', 'agente_saude', 'superadmin')
    )
  );
```

---

## 🎨 COMPONENTES PRINCIPAIS

### 1. Sistema de Autenticação
```typescript
// hooks/useAuth.ts
interface User {
  id: string;
  email: string;
  tipo_usuario: 'superadmin' | 'admin_obs' | 'agente_saude' | 'populacao';
  obs_id?: string;
  nome: string;
}

// Funcionalidades:
- Login com email/senha
- Registro de novos usuários
- Reset de senha
- Verificação de email
- Logout
- Persistência de sessão
```

### 2. Dashboard por Perfil

#### SuperAdmin Dashboard
```typescript
Componentes:
- Lista de OBS (tabela com filtros)
- Gráficos globais (total OBS, usuários, eventos)
- Botão "Nova OBS"
- Status de cada OBS
- Métricas de uso
- Logs de sistema
```

#### Admin OBS Dashboard
```typescript
Componentes:
- Stats da OBS (eventos, agentes, dúvidas)
- Calendário de eventos
- Lista de agentes
- Dúvidas pendentes
- Gráficos de atendimento
```

#### Agente Saúde Dashboard
```typescript
Componentes:
- Calendário de eventos
- Formulário rápido de evento
- Lista de médicos disponíveis
- Dúvidas da população
```

#### Portal Público
```typescript
Componentes:
- Busca de eventos
- Calendário público
- Formulário de dúvida
- Lista de médicos disponíveis
```

### 3. Formulários Principais

```typescript
// FormNovaOBS.tsx
- Nome, cidade, estado
- CNPJ, telefone, email
- Domínio customizado
- Webhook WhatsApp
- Upload de logo
- Validação com Zod

// FormEvento.tsx
- Tipo, título, descrição
- Data início/fim
- Horário
- Posto de saúde
- Profissional responsável
- Vagas disponíveis
- Público alvo

// FormMedico.tsx
- Nome, CRM, especialidade
- Posto de saúde
- Data e horário
- Vagas disponíveis

// FormDuvida.tsx (público)
- Nome, email, WhatsApp
- Categoria
- Pergunta
```

---

## 🔗 SISTEMA DE APIs E WEBHOOKS

### Rotas API Internas
```typescript
// src/lib/api.ts

// POST /api/obs/:obs_id/eventos
export async function receberEventoWebhook(obs_id: string, payload: any) {
  // Validar payload
  // Inserir no Supabase
  // Retornar confirmação
}

// POST /api/obs/:obs_id/medicos
export async function receberMedicoWebhook(obs_id: string, payload: any) {
  // Validar payload
  // Inserir no Supabase
  // Retornar confirmação
}

// POST /api/obs/:obs_id/duvidas
export async function receberDuvidaWebhook(obs_id: string, payload: any) {
  // Validar payload
  // Inserir no Supabase
  // Notificar admin
  // Retornar confirmação
}
```

### Integração n8n
```json
{
  "webhook_url": "https://seu-dominio.com/api/obs/{obs_id}/eventos",
  "method": "POST",
  "headers": {
    "Content-Type": "application/json",
    "Authorization": "Bearer {token}"
  },
  "body": {
    "tipo": "vacina",
    "titulo": "Vacinação Infantil",
    "data_inicio": "2025-02-20",
    "horario_inicio": "08:00",
    "horario_fim": "17:00",
    "posto_saude": "UBS Centro"
  }
}
```

---

## ✅ CHECKLIST DE DESENVOLVIMENTO

### FASE 1: Setup Inicial (Dia 1-2)
- [ ] Criar projeto Vite + React + TypeScript
- [ ] Configurar Tailwind CSS
- [ ] Instalar shadcn/ui
- [ ] Configurar React Router
- [ ] Conectar Supabase
- [ ] Criar estrutura de pastas
- [ ] Configurar ESLint e Prettier

### FASE 2: Autenticação (Dia 3-4)
- [ ] Página de login
- [ ] Página de registro
- [ ] Reset de senha
- [ ] Hook useAuth
- [ ] Proteção de rotas
- [ ] Persistência de sessão
- [ ] Redirect após login por tipo de usuário

### FASE 3: Database e RLS (Dia 5-6)
- [ ] Criar todas as tabelas no Supabase
- [ ] Implementar RLS policies
- [ ] Criar triggers e functions
- [ ] Testar políticas de acesso
- [ ] Criar seeds para testes

### FASE 4: Layout e Navegação (Dia 7-8)
- [ ] Header com menu
- [ ] Sidebar responsivo
- [ ] Footer
- [ ] Layout por perfil
- [ ] Breadcrumbs
- [ ] Menu mobile

### FASE 5: Dashboard SuperAdmin (Dia 9-11)
- [ ] Lista de OBS (tabela)
- [ ] Formulário nova OBS
- [ ] Editar OBS
- [ ] Ativar/desativar OBS
- [ ] Gráficos de métricas
- [ ] Lista de todos os usuários
- [ ] Logs de auditoria

### FASE 6: Dashboard Admin OBS (Dia 12-14)
- [ ] Stats da OBS
- [ ] Lista de agentes
- [ ] Adicionar/remover agentes
- [ ] Lista de eventos
- [ ] Calendário de eventos
- [ ] Dúvidas pendentes
- [ ] Responder dúvidas
- [ ] Configurações da OBS

### FASE 7: Dashboard Agente (Dia 15-16)
- [ ] Calendário de eventos
- [ ] Criar novo evento
- [ ] Editar evento
- [ ] Adicionar médico disponível
- [ ] Lista de dúvidas
- [ ] Dashboard resumido

### FASE 8: Portal Público (Dia 17-18)
- [ ] Página inicial
- [ ] Busca de eventos
- [ ] Filtros (data, tipo, posto)
- [ ] Calendário público
- [ ] Lista de médicos
- [ ] Formulário de dúvida
- [ ] Página de contato

### FASE 9: Webhooks e APIs (Dia 19-20)
- [ ] Endpoint receber eventos
- [ ] Endpoint receber médicos
- [ ] Endpoint receber dúvidas
- [ ] Validação de payloads
- [ ] Autenticação de webhook
- [ ] Documentação da API

### FASE 10: Features Avançadas (Dia 21-23)
- [ ] Sistema de notificações
- [ ] Upload de logo da OBS
- [ ] Exportação de relatórios (PDF)
- [ ] Gráficos e analytics
- [ ] Histórico de alterações
- [ ] Sistema de busca avançada

### FASE 11: UX/UI e Responsividade (Dia 24-25)
- [ ] Ajustes mobile
- [ ] Loading states
- [ ] Error boundaries
- [ ] Toasts de feedback
- [ ] Animações
- [ ] Dark mode (opcional)

### FASE 12: Testes e Deploy (Dia 26-30)
- [ ] Testes unitários principais
- [ ] Testes de integração
- [ ] Testes E2E (Playwright)
- [ ] Otimização de performance
- [ ] Build de produção
- [ ] Deploy (Vercel/Netlify)
- [ ] Configurar domínio
- [ ] Monitoramento (Sentry)

---

## 🎯 ORDEM DE PRIORIDADE

### ALTA PRIORIDADE (MVP)
1. Autenticação e autorização
2. CRUD de OBS (SuperAdmin)
3. CRUD de usuários
4. CRUD de eventos
5. Dashboard básico por perfil
6. Portal público com calendário
7. Sistema de dúvidas

### MÉDIA PRIORIDADE
1. Webhooks n8n
2. Upload de arquivos
3. Notificações
4. Gráficos e relatórios
5. Busca avançada
6. Logs de auditoria

### BAIXA PRIORIDADE (Futuro)
1. WhatsApp integration
2. App mobile
3. Notificações push
4. Chat em tempo real
5. Sistema de agendamento online
6. Integração com e-SUS

---

## 🚀 COMANDOS PARA COMEÇAR

```bash
# Criar projeto
npm create vite@latest multi-obs-saude -- --template react-ts
cd multi-obs-saude

# Instalar dependências
npm install
npm install -D tailwindcss postcss autoprefixer
npm install @supabase/supabase-js
npm install react-router-dom
npm install @tanstack/react-query
npm install zustand
npm install react-hook-form zod @hookform/resolvers
npm install date-fns
npm install recharts
npm install lucide-react

# shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add select
npx shadcn-ui@latest add calendar
npx shadcn-ui@latest add toast

# Iniciar projeto
npm run dev
```

---

## 📝 PRÓXIMOS PASSOS

1. **Criar o projeto base** com a estrutura de pastas
2. **Configurar Supabase** e criar as tabelas
3. **Implementar autenticação** completa
4. **Desenvolver página SuperAdmin** (gestão de OBS)
5. **Desenvolver dashboards** específicos por perfil
6. **Implementar portal público**
7. **Adicionar webhooks**
8. **Polir UX/UI**
9. **Testes e deploy**

---

## 🎓 DICAS IMPORTANTES

### Segurança
- Sempre validar dados no backend (Supabase functions)
- Usar RLS em todas as tabelas
- Sanitizar inputs do usuário
- Usar HTTPS em produção
- Rotacionar tokens e secrets

### Performance
- Usar React Query para cache
- Implementar paginação
- Lazy loading de componentes
- Otimizar imagens
- Usar CDN para assets

### Manutenibilidade
- TypeScript em todo o projeto
- Comentários em código complexo
- Documentar APIs
- Versionar schema do banco
- Manter changelog

### UX
- Feedback visual imediato
- Loading states claros
- Mensagens de erro amigáveis
- Confirmar ações destrutivas
- Responsividade mobile-first

---

## 📞 SUPORTE E RECURSOS

- **Supabase Docs**: https://supabase.com/docs
- **shadcn/ui**: https://ui.shadcn.com
- **React Query**: https://tanstack.com/query
- **Tailwind CSS**: https://tailwindcss.com
- **n8n Webhooks**: https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.webhook/

---

Este prompt está pronto para ser usado com Claude Code. Siga o checklist e desenvolva fase por fase para garantir qualidade e organização do projeto.
