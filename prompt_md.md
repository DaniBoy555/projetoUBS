# Prompt para Sistema Multi-OBS de Saúde (Lovable.dev)

## Descrição Geral
Crie um sistema multi-tenant para gestão de informações de saúde públicas usado por múltiplas OBS de todo o Brasil. O sistema deve suportar 4 tipos de usuários:

1. **SuperAdmin** – controla todas as OBS (clientes)
2. **AdminOBS** – administrador local da OBS
3. **AgenteDeSaude** – cadastra e gerencia informações da OBS
4. **Populacao** – acessa informações e envia dúvidas

Cada OBS deve ter seus dados separados e identificados pelo campo `obs_id`. Nenhum usuário pode visualizar dados de outra OBS (exceto SuperAdmin).

---

## Estrutura Multi-Tenant
Todas as tabelas devem possuir o campo obrigatório:
```
obs_id
```

O sistema deve permitir:
- criar uma nova OBS
- configurar dados da OBS
- vincular agentes e admins locais à OBS correta
- exibir apenas dados relacionados à OBS
- ativar/desativar OBS

---

## Perfis e Permissões

### SUPERADMIN
- criar e gerenciar OBS
- gerenciar admins locais
- ver relatórios globais
- configurar webhooks e APIs

### ADMINOBS
- gerenciar agentes da sua OBS
- editar dados da OBS
- revisar cadastros e eventos
- responder dúvidas

### AGENTE DE SAÚDE
- cadastrar eventos de saúde
- cadastrar médicos disponíveis
- editar informações gerais
- visualizar perguntas da população

### POPULAÇÃO
- acessar calendário público
- buscar eventos e informações
- enviar dúvidas

---

## Tabelas do Sistema

### OBS
- id (obs_id)
- nome
- cidade
- estado
- telefone
- email
- domínio
- webhookWhatsApp
- status

### AdminOBS
- nome
- email
- telefone
- senha
- obs_id

### AgentesSaude
- nome
- email
- telefone
- posto
- senha
- obs_id

### EventosSaude
- tipo (vacina, médico, campanha, etc.)
- título
- data
- horário
- descrição
- posto
- profissionalResponsavel
- obs_id

### MedicosDisponiveis
- nome
- especialidade
- posto
- data
- horário
- obs_id

### DuvidasPopulacao
- nomePessoa
- numeroWhatsApp
- pergunta
- resposta
- dataPergunta
- dataResposta
- obs_id

---

## APIs Internas e Webhooks
Criar rotas para receber dados via webhook do n8n:
```
POST /api/obs/:obs_id/eventos
POST /api/obs/:obs_id/medicos
POST /api/obs/:obs_id/duvidas
```

Comportamento:
- receber JSON
- validar
- salvar na tabela correta
- atualizar a interface automaticamente

Exemplo de payload:
```json
{
  "tipo": "vacina",
  "titulo": "Vacinação contra Influenza",
  "data": "2025-02-20",
  "horario": "08:00-17:00",
  "posto": "UBS Centro",
  "profissionalResponsavel": "Enfermeira Ana"
}
```

---

## Interface por Tipo de Usuário

### SUPERADMIN
- painel com lista de todas as OBS
- botões de criação/edição
- gráficos e métricas globais
- configurações de API e webhook

### ADMINOBS
- painel completo da sua OBS
- gestão de agentes e médicos
- gestão de eventos
- acompanhar dúvidas e responder

### AGENTE
- dashboard com eventos
- cadastros rápidos
- visualização do calendário
- painel de dúvidas da população

### POPULAÇÃO
- calendário público
- busca por eventos e avisos
- botão "fazer pergunta"

---

## Lógica de Filtragem
Sempre aplicar:
```
obs_id == usuario.obs_id
```

---

## Supabase
O sistema deve utilizar o **Supabase** como banco de dados principal, garantindo segurança, escalabilidade e APIs automáticas.

- usar autenticação do Supabase
- usar tabelas com relacionamento por `obs_id`
- usar policies (RLS) para garantir que cada usuário veja apenas dados da sua OBS
- integrar webhooks ao Supabase (insert/update)
- permitir sincronização em tempo real quando necessário

## Objetivo Final
Criar um sistema completo, escalável e pronto para comercialização nacional, com integração via webhook do n8n, multi-OBS, e interface moderna para agentes e população.

