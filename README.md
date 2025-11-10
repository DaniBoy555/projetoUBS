# Multi-OBS Saúde - Dashboard SuperAdmin

Sistema multi-tenant para gestão de informações de saúde públicas usado por múltiplas OBS de todo o Brasil.

## Status do Projeto

✅ **Dashboard SuperAdmin implementado com sucesso!**

Atualmente funcionando com dados fictícios (mock) - sem banco de dados.

## Tecnologias Utilizadas

- **React 19.2.0** - Framework JavaScript
- **TypeScript 5.9.3** - Tipagem estática
- **Vite 7.2.2** - Build tool e dev server
- **Tailwind CSS 4.1.17** - Framework CSS
- **shadcn/ui** - Componentes UI (dashboard-01)
- **React Router DOM** - Roteamento
- **Lucide React** - Ícones
- **Recharts** - Gráficos
- **date-fns** - Manipulação de datas

## Estrutura do Projeto

```
projetoUBS/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes shadcn/ui
│   │   ├── app-sidebar.tsx  # Sidebar customizada
│   │   ├── site-header.tsx  # Header
│   │   └── ...
│   ├── pages/
│   │   └── superadmin/
│   │       ├── Dashboard.tsx          # Dashboard principal
│   │       ├── OBSManagement.tsx      # Gestão de OBS
│   │       └── UserManagement.tsx     # Gestão de usuários
│   ├── lib/
│   │   ├── utils.ts         # Utilitários
│   │   └── mock-data.ts     # Dados fictícios
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   ├── hooks/               # Custom hooks
│   ├── App.tsx              # App principal com rotas
│   ├── main.tsx             # Entry point
│   └── index.css            # Estilos globais
├── docs/                    # Documentação do projeto
└── ...
```

## Funcionalidades Implementadas

### Dashboard SuperAdmin

1. **Dashboard Principal** (`/superadmin`)
   - Cards de estatísticas (Total OBS, Usuários, Eventos, Dúvidas)
   - Tabela de OBS cadastradas
   - Logs de auditoria recentes
   - Visualização de métricas gerais

2. **Gestão de OBS** (`/superadmin/obs`)
   - Lista completa de todas as OBS
   - Busca por nome, cidade ou estado
   - Visualização de status (ativo, inativo, suspenso)
   - Ações: Editar e Ativar/Desativar
   - Cards de estatísticas por status
   - Filtros e paginação

3. **Gestão de Usuários** (`/superadmin/usuarios`)
   - Lista completa de todos os usuários
   - Busca por nome ou email
   - Filtro por tipo de usuário (SuperAdmin, Admin OBS, Agente, População)
   - Visualização de informações completas
   - Cards de estatísticas por tipo
   - Ações de edição

### Componentes UI

- **Sidebar** - Navegação lateral responsiva com:
  - Links para Dashboard, Gestão de OBS, Gestão de Usuários
  - Menu secundário (Configurações, Ajuda)
  - Seção de documentos (Logs, Docs)
  - Perfil do usuário no rodapé

- **Header** - Cabeçalho com:
  - Logo do sistema
  - Menu de navegação
  - Ícones de ação

- **Tabelas** - DataTables com:
  - Paginação
  - Busca e filtros
  - Badges de status
  - Ações por linha

- **Cards** - Cards de métricas com:
  - Ícones
  - Valores numéricos
  - Descrições
  - Cores por status

## Dados Fictícios

O sistema está funcionando com dados mock incluindo:

- **10 OBS** de diferentes estados brasileiros
- **6 Usuários** com diferentes perfis
- **2 Eventos de Saúde** ativos
- **2 Médicos disponíveis**
- **2 Dúvidas da população**
- **3 Logs de auditoria**

Todos os dados estão em [src/lib/mock-data.ts](src/lib/mock-data.ts).

## Como Executar

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse: http://localhost:5173

### Build

```bash
npm run build
```

### Preview

```bash
npm run preview
```

## Rotas Disponíveis

| Rota | Descrição |
|------|-----------|
| `/login` | **✅ NOVO** Página de login (shadcn/ui login-04) |
| `/superadmin` | Dashboard principal do SuperAdmin |
| `/superadmin/obs` | Gestão de OBS |
| `/superadmin/usuarios` | Gestão de Usuários |
| `/superadmin/relatorios` | Relatórios (em desenvolvimento) |
| `/superadmin/configuracoes` | Configurações (em desenvolvimento) |

## Próximos Passos

Para continuar o desenvolvimento, consulte o [checklist de desenvolvimento](docs/checklist-desenvolvimento.md):

### Fase 2: Autenticação
- [x] Criar página de login ✅ **CONCLUÍDO**
- [ ] Implementar hook useAuth
- [ ] Proteger rotas privadas
- [ ] Adicionar lógica de autenticação ao formulário

### Fase 3: Database e RLS
- [ ] Configurar Supabase
- [ ] Criar tabelas com RLS
- [ ] Migrar de mock para dados reais

### Fase 4-12: Features Completas
Ver [docs/checklist-desenvolvimento.md](docs/checklist-desenvolvimento.md) para detalhes completos.

## Documentação

Toda a documentação do projeto está na pasta `docs/`:

- [Checklist de Desenvolvimento](docs/checklist-desenvolvimento.md)
- [Exemplos de Código](docs/exemplos-codigo.md)
- [Prompt Multi-OBS](docs/prompt-claude-code-multi-obs.md)
- [Especificações](docs/prompt_md.md)

## Layout Responsivo

O dashboard foi desenvolvido com mobile-first e é totalmente responsivo:

- ✅ Mobile (375px+)
- ✅ Tablet (768px+)
- ✅ Desktop (1024px+)
- ✅ Wide (1920px+)

## Contribuindo

Este é um projeto em desenvolvimento. Para contribuir:

1. Consulte a documentação em `docs/`
2. Siga as fases do checklist
3. Mantenha o padrão de código TypeScript
4. Use os componentes shadcn/ui sempre que possível

## Licença

Projeto desenvolvido para uso em Unidades Básicas de Saúde (UBS) do Brasil.

---

**Desenvolvido com:** React + TypeScript + Vite + shadcn/ui + Tailwind CSS

**Última atualização:** 10/11/2025
