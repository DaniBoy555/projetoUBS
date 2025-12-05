## **1\. Panorama dos sistemas oficiais**

### **1.1 SISAB / Financiamento da APS**

* SISAB \= Sistema de Informação em Saúde para a Atenção Básica.

* Ele é o “balde federal” que recebe os dados enviados pelos municípios.

* A partir de 2024, o Ministério substituiu o modelo “Previne Brasil” por uma nova metodologia de cofinanciamento do Piso da Atenção Primária, via Portaria GM/MS nº 3.493/2024, mas os dados continuam sendo enviados e consolidados via SISAB.

* Portarias recentes deixam claro: se o município não alimentar o SISAB, o Ministério suspende repasse de incentivos.

“O dinheiro da Atenção Primária continua vindo em cima de dado registrado, enviado e aceito pelo SISAB. Se não registrar, não mandar ou mandar errado, corta repasse.”

### **1.2 e-SUS APS (guarda-chuva)**

“e-SUS APS” é o guarda-chuva de ferramentas do Ministério para Atenção Primária. Os três blocos principais:

1. PEC – Prontuário Eletrônico do Cidadão

   * Usado nas UBS para atendimentos clínicos (médico, enfermeiro, dentista, etc.).

   * Armazena: consultas, procedimentos, receitas, acompanhamentos.

   * Banco geralmente em PostgreSQL no servidor da prefeitura.

2. CDS – Coleta de Dados Simplificada

   * Fichas (digitais ou papel → digitação) para cadastros, visitas e procedimentos onde não se usa PEC em tempo real (zona rural, unidade sem estrutura, etc.).

   * Pode ser digitado em um sistema local e depois enviado.

3. e-SUS Território (App do ACS)

   * App oficial em tablet/celular para Agentes Comunitários de Saúde.

   * Faz: cadastro domiciliar, cadastro individual, visitas, território/microárea.

   * Sincroniza com o banco do e-SUS APS e alimenta PEC/CDS.

Resumo pro slide:

PEC \= clínica  
CDS \= fichas simplificadas / contingência  
Território \= campo / agente de saúde  
SISAB \= ministério (onde cai tudo)  
---

## **2\. Onde a Nexx Saúde entra**

Você NÃO vai tentar substituir esses sistemas. Vai:

* Ler o que eles já produzem (PEC, CDS, Território).

* Auditar e organizar os dados.

* Traduzir isso em dinheiro, indicadores e decisões pro gestor.

* Eventualmente, complementar onde falta ferramenta (ex.: município sem Território).

### **2.1 Proposta de valor em uma frase**

“A Nexx pega tudo o que o município já registra no e-SUS APS, limpa, cruza, analisa com IA e entrega um painel que mostra exatamente onde o gestor está perdendo dinheiro e como recuperar.”

### **2.2 O que o sistema resolve**

Pra sua reunião, lista pronta:

1. Problema 1 – Dado incompleto/errado

   * CPF/CNS errado, fichas incompletas, cadastro não vinculado à equipe, óbito não registrado…

   * Consequência: produção não conta no SISAB → perda de repasse.

2. Nexx resolve: auditoria automática \+ lista de “erros críticos” por UBS, equipe e profissional.

3. Problema 2 – Falta de visão unificada

   * PEC mostra consulta, Território mostra visita, CDS mostra ficha… mas o gestor não vê o “filme completo”.

4. Nexx resolve: consolida PEC \+ CDS \+ Território num Data Warehouse municipal e mostra isso em dashboards amigáveis.

5. Problema 3 – Gestor reage, não antecipa

   * Só descobre problema de indicador quando o quadrimestre fecha (e o dinheiro já foi pro saco).

6. Nexx resolve: painel de projeção – “Se fechar hoje, você perde X”, com IA marcando quais ações priorizar.

7. Problema 4 – Equipe sem cobrança clara

   * Secretário não sabe qual ACS está produzindo bem, quem não sincroniza, onde está travando.

8. Nexx resolve: ranking de produtividade, acompanhamento de sincronização, metas por equipe/microárea.

---

## **3\. Como a Nexx vai agir em cada sistema**

### **3.1 PEC (Prontuário Eletrônico)**

O que é:

Base oficial dos atendimentos clínicos.

O que a Nexx faz:

* Instala um conector de leitura no servidor municipal (read-only).

* Extrai, periodicamente:

  * atendimentos,

  * diagnósticos,

  * procedimentos,

  * vínculos profissional–equipe–UBS.

Entregas a partir do PEC:

* Indicadores de seguimento de crônicos (HAS/DM) usando consultas e procedimentos.

* Cruzamento “consulta registrada” x “visita registrada” (PEC \+ Território).

* Análise de produtividade ambulatorial por profissional e UBS.

### **3.2 CDS (Coleta de Dados Simplificada)**

O que é:

Fichas de cadastros/visitas em locais sem PEC.

Nexx faz:

* Lê os arquivos de produção CDS (geralmente exportados pelo próprio e-SUS).

* Padroniza e integra com a base única Nexx.

* Aplica regras de auditoria: campos obrigatórios, vínculos, duplicidades.

Entregas a partir do CDS:

* Cobertura cadastral por microárea (mesmo onde não há PEC).

* Detecção de áreas com muita ficha incompleta (problema de treinamento/pessoal).

### **3.3 e-SUS Território (App do ACS)**

O que é:

App oficial do ACS para cadastro e visitas.

Nexx faz:

* NÃO substitui o app oficial (nos municípios que já usam).

* Conecta nas bases de dados que recebem os dados do Território (no servidor da prefeitura).

* Reconstrói o “mapa vivo” do território:

  * imóveis,

  * famílias,

  * visitas,

  * acamados, gestantes, crônicos.

Entregas a partir do Território:

* Painel de metas territoriais (visitas mínimas por perfil).

* Mapa de calor de risco (áreas com muitos crônicos/gestantes não visitados).

* Indicadores de rotina do ACS (quantos dias sem visita, sem sincronizar, etc.).

### **3.4 SISAB / e-Gestor**

Você não mexe diretamente no SISAB, mas:

* Usa relatórios do e-Gestor AB como fonte de verdade para:

  * conferir se o que o Nexx calculou bate com os dados aceitos pelo Ministério;

  * mostrar ao gestor o “Antes/Depois” de contratar a Nexx.

---

## **4\. Produto e modelo de negócio**

Você falou: setup 130 mil \+ recorrência 24,9k/mês (plano 1). Vamos encaixar isso na lógica dos módulos.

### **4.1 Estrutura de produto**

Produto principal:

👉 Nexx Saúde – Plataforma de Inteligência para Atenção Primária

Inclui:

1. Módulo Inteligência PEC

2. Módulo Inteligência CDS

3. Módulo Inteligência Território

4. Camada IA Auditoria (regras \+ insights)

5. Consultoria mensal e suporte especializado

### **4.2 Setup (Implantação)** 

Em 120 dias, você entrega:

1. Fase 1 – Diagnóstico & Dados (D1–D30)

   * Instalação de conectores PEC/CDS/Território.

   * Auditoria da base (quantos cadastros ruins, indicadores vulneráveis).

   * Relatório inicial: “Retrato da APS hoje”.

2. Fase 2 – Configuração & Painéis (D31–D60)

   * Modelagem das visões do dashboard (por UBS, por equipe, por indicador).

   * Parametrização específica do município (metas locais, microáreas, etc.).

   * Primeiro protótipo do painel para secretário/coordenador.

3. Fase 3 – Capacitação & Governança (D61–D90)

   * Treinamento de:

     * coordenação da APS,

     * enfermeiros,

     * equipe responsável por digitação/registro.

   * Implantação do rito mensal: reunião de indicadores \+ plano de ação.

4. Fase 4 – Estabilização (D91–D120)

   * Acompanhamento junto às equipes para fechar um ciclo completo de envio ao SISAB usando o Nexx como guia.

   * Ajustes finos nos painéis e nas regras da IA.

Você vende isso como:

“Programa de Modernização da Atenção Básica em 120 dias, com entrega de plataforma, auditoria de dados e mudança de cultura de uso da informação.”

### **4.3 Recorrência –** Dividindo o valor pra ficar claro na reunião:

* SaaS / Infra / Licença –

  * hospedagem,

  * manutenção,

  * atualizações,

  * segurança/LGPD.

* Consultoria de Inteligência –

  * relatório mensal de indicadores e risco financeiro;

  * análise de PEC+CDS+Território;

  * recomendação de ações (foco em ROI).

* Suporte & Sucesso do Cliente –

  * suporte remoto nível gestor;

  * reciclagem trimestral;

  * apoio em portarias novas e mudanças de regra.

Mensagem pro prefeito:

“É um time de BI, TI, consultoria em APS e IA trabalhando pra sua secretaria por menos do que o custo de manter 2 analistas CLT.”  
---

## **5\. Escala saudável (sem quebrar a Nexx)**

### **5.1 Time mínimo por 10 municípios**

Pra ter noção de escala, algo assim:

* 1 Tech Lead / Arquiteto

* 2 Devs (back \+ front)

* 1 Analista de Dados/BI

* 1 Especialista em Saúde Pública / Previne / APS

* 1 CS/Implementação (faz ponte com o município)

* 1 Suporte N1 (operacional)

Com esse time, você consegue manter de 5 a 10 municípios rodando, se o produto for bem “productizado” (mesma base, só parametrização).

### **5.2 Risco de operação**

Pra levar pra conversa com sócios:

* Risco técnico: integração com bancos da prefeitura (cada canto tem um padrãozinho).

   → Mitigação: definir desde já um conector padrão para PostgreSQL do PEC, e um kit de scripts de importação de CDS.

* Risco político: troca de gestor, mudança de prioridade.

   → Mitigação: amarrar o valor da Nexx sempre a dinheiro a mais na conta (mostrar projeção de ganho/perda).

* Risco de “fazer tudo sob medida”: cair na armadilha de customização infinita.

   → Mitigação: deixar claro que o Nexx tem módulos padrão; ajustes são parametrização, não software novo

# 

# **ECOSSISTEMA NEXX SAÚDE**

Documento para Alinhamento com Sócios e Programadores

Versão: 1.0 – MVP Estratégico

---

## **1\. VISÃO GERAL**

O que é o Nexx Saúde?

O Nexx Saúde não é um sistema para substituir o e-SUS ou o software que a prefeitura já usa.

Ele é uma Camada de Inteligência (middleware) que:

* Lê os dados que já existem (PEC, CDS, e-SUS Território).

* Organiza, audita e cruza essas informações.

* Gera indicadores, alertas e projeção financeira para o gestor.

* Apoia a equipe com consultoria e rotina de acompanhamento.

Frase de posicionamento:

“Transformamos dados desorganizados da Atenção Básica em indicadores claros, ações práticas e mais recursos financeiros para o município.”  
---

## **2\. SISTEMAS DO GOVERNO – CONTEXTO**

### **2.1 SISAB**

* Repositório nacional onde caem os dados enviados pelos municípios.

* É a base usada pelo Ministério para calcular repasses e desempenho da Atenção Primária.

* Se o município não envia, envia pouco ou envia errado, perde dinheiro.

### **2.2 e-SUS APS – Blocos principais**

1. PEC – Prontuário Eletrônico do Cidadão

   * Usado nas UBS para registrar consultas, procedimentos, acompanhamentos, prescrições.

   * Fica em servidor local da prefeitura (geralmente PostgreSQL).

2. CDS – Coleta de Dados Simplificada

   * Fichas (digitais ou papel) para cadastros e visitas onde não se usa PEC em tempo real.

   * Muito usado em área rural e unidades sem boa estrutura.

3. e-SUS Território

   * Aplicativo em tablet/celular do Agente Comunitário de Saúde (ACS).

   * Faz cadastro domiciliar, cadastro individual, visitas, registro de microárea.

   * Sincroniza com o e-SUS APS e alimenta a base do município.

Resumo pra reunião:

* PEC \= Clínica / UBS

* CDS \= Fichas simplificadas / contingência

* Território \= Campo / ACS

* SISAB \= Governo Federal

O Nexx Saúde entra por cima disso tudo, sem brigar com nenhum deles.

---

## **3\. O QUE O NEXX SAÚDE RESOLVE**

### **3.1 Problemas típicos da Atenção Básica**

1. Dados incompletos ou errados

   * CPF/CNS errado, campos obrigatórios em branco, cadastros duplicados, pessoas que já morreram ainda “ativas”.

   * Resultado: produção não conta no SISAB → perda de repasse.

2. Visão fragmentada

   * PEC mostra consultas, CDS mostra fichas, Território mostra visitas.

   * O gestor não tem uma visão única do território, da população e da produção.

3. Gestor reage tarde

   * Problemas de indicadores só aparecem quando o período fecha.

   * Quando descobre, o dinheiro já foi perdido.

4. Dificuldade de cobrança da equipe

   * Secretário não sabe qual ACS está produzindo bem, quem não sincroniza, onde estão as pendências.

### **3.2 Como o Nexx atua nesses problemas**

1. Auditoria de qualidade de dados

   * Algoritmos que varrem PEC, CDS e Território atrás de:

     * cadastros incompletos,

     * erros lógicos (ex.: gestação em homem),

     * duplicidades,

     * vínculos errados com equipes/UBS.

   * Gera listas organizadas por UBS, equipe e profissional.

2. Visão unificada da Atenção Básica

   * Data warehouse municipal: junta PEC \+ CDS \+ Território numa base única do Nexx.

   * A partir daí, constrói painéis e relatórios amigáveis.

3. Projeção e alerta (antes de perder o dinheiro)

   * Painéis que mostram:

     * situação atual dos principais indicadores,

     * projeção de cenário (“se fechar hoje, você perde X”),

     * quais ações priorizar (quem visitar, qual UBS corrigir).

4. Gestão da equipe e rotina

   * Ranking de produtividade por ACS e por UBS.

   * Monitoramento de sincronização: quem está há vários dias sem enviar dados.

   * Metas e acompanhamento contínuo.

---

## **4\. ARQUITETURA TÉCNICA DO ECOSSISTEMA**

### **4.1 Módulo Nexx Mobile (quando usado)**

Usado em dois cenários:

* Município sem e-SUS Território → Nexx oferece seu próprio app de campo.

* Município com e-SUS Território → Nexx não substitui, apenas complementa (foco no dashboard e IA).

Características do app Nexx (quando implementado):

* Tecnologia: Flutter (Android).

* Banco local: SQLite criptografado.

* Funcionalidades:

  * Cadastro domiciliar, cadastro individual, visitas.

  * Trabalho 100% offline com sincronização posterior.

  * Validação de CPF/CNS na entrada.

  * Geolocalização automática em cadastros/visitas.

  * Metas visíveis para o ACS (“faltam X visitas para sua meta”).

### **4.2 Módulo Nexx Core (integração e dados)**

* Backend (Node / Python) com banco PostgreSQL.

* Faz leitura apenas (read-only) dos bancos:

  * PEC,

  * CDS,

  * Território (onde existir).

* Normaliza e grava tudo numa base única Nexx.

* Mantém logs e trilhas de auditoria.

### **4.3 Módulo Nexx AI (auditoria e insights)**

* Conjunto de regras \+ IA para:

  * encontrar cadastros que travam envio;

  * identificar pessoas de risco sem acompanhamento recente;

  * apontar inconsistências grosseiras;

  * gerar listas priorizadas para ação (por equipe/UBS).

### **4.4 Módulo Nexx Vision (Dashboard do Gestor)**

Principais painéis:

1. Visão Financeira / Indicadores

   * Situação atual dos indicadores-chave (modelo novo de financiamento, antes “Previne Brasil”).

   * Projeção de perda/ganho financeiro com base na produção registrada.

2. Produtividade por equipe / profissional

   * Quantidade de atendimentos (PEC).

   * Quantidade de visitas / cadastros (CDS/Território ou app Nexx).

   * Status de sincronização.

3. Mapa de Saúde e Risco

   * Geolocalização de:

     * gestantes,

     * hipertensos / diabéticos,

     * acamados,

     * áreas com baixa cobertura de visita.

4. Painel de Auditoria

   * Quantos cadastros com erro crítico.

   * Quantos já foram corrigidos.

   * Pendências por UBS / equipe.

---

## **5\. COMO A NEXX ATUA EM CADA SISTEMA OFICIAL**

### **5.1 PEC**

* Instala um conector de leitura no servidor da prefeitura.

* Lê atendimentos, diagnósticos, procedimentos, vínculos profissional–equipe–UBS.

* Usa isso para:

  * medir seguimento de crônicos,

  * cruzar com visitas de ACS,

  * gerar relatórios de produtividade clínica.

### **5.2 CDS**

* Importa arquivos de produção CDS.

* Checa:

  * campos obrigatórios,

  * vínculos com equipe/UBS,

  * duplicidade de cadastros.

* Usa isso para:

  * medir cobertura cadastral,

  * apontar onde falta qualificação da equipe.

### **5.3 e-SUS Território**

* Em municípios que já usam:

  * Lê a base que recebe os dados do Território.

  * Reconstrói mapa de imóveis, famílias, pessoas e visitas.

  * Constrói painéis de metas e rotinas para os ACS.

* Em municípios que ainda não usam:

  * Nexx pode ofertar app próprio como “Território Nexx” \+ consultoria de implementação.

### **5.4 SISAB / Relatórios oficiais**

* Nexx não substitui o SISAB.

* Usa relatórios oficiais para:

  * conferência de dados;

  * mostrar “antes/depois” ao gestor, provando o impacto do sistema.

## **7\. ESCALA SAUDÁVEL (VISÃO INTERNA NEXX)**

### **7.1 Time mínimo para operar vários municípios**

Base para discussão com sócios:

* 1 Tech Lead / Arquiteto

* 1 Dev Backend

* 1 Dev Front/Dashboard

* 1 Analista de Dados/BI

* 1 Especialista em Saúde Pública/APS

* 1 CS/Implantação

* 1 Suporte N1

Esse time, com produto estável, consegue cuidar de 5 a 10 municípios em produção.

### **7.2 Riscos principais e mitigação**

* Integração difícil (bancos diferentes, ambiente bagunçado)

   → Ter conectores padrão \+ roteiro técnico bem fechado.

* Mudança de gestão / política

   → Focar sempre em demonstrar resultado financeiro concreto e rápido.

* Excesso de customização

   → Proteger o produto: vender módulos padrão e limitar “coisa sob medida” a parametrizações.

---

Esse documento é o “mapa mental oficial” do Nexx Saúde hoje:

* o que o governo já tem,

* o que o Nexx faz em cima,

* como cobra,

* e como isso escala.

# **MANUAL MESTRE — PRODUÇÃO \+ IMPLANTAÇÃO REALISTA**

Modelo: Nexx 90 (Laboratório) → Nexx 120 (Escala)

Foco: proteger dev, garantir qualidade, formar método, só depois vender.

---

## **PARTE 1\) NEXX 90 — PRODUÇÃO E VALIDAÇÃO (Município Parceiro)**

### **Objetivo dos 90 dias**

1. Construir MVP com calma e qualidade.

2. Testar em campo com pressão baixa.

3. Ajustar UX, bugs, integrações e rotinas.

4. Deixar consultoria e capacitação prontas.

5. Criar portfólio real (prints, números, cases).

### **Princípio-Pai**

Nenhuma fase depende de “correr”. Depende de “validar”.

---

## **MÊS 1 (Dias 1–30) — FUNDAÇÃO DO PRODUTO \+ PREPARAÇÃO OPERACIONAL**

### **Trilha A — DEV (produção)**

Meta do mês: “colocar o esqueleto em pé”.

1. Arquitetura e base técnica

   * Banco central (Postgres)

   * Estrutura offline-first do app

   * Autenticação

   * Hierarquia territorial (logradouro → imóvel → família → cidadão)

2. App ACS: núcleo navegável

   * Login

   * Dashboard simples (sem metas complexas ainda)

   * Lista de ruas e imóveis

   * Cadastro domiciliar básico

   * Cadastro individual (etapas)

3. Infra mínima

   * Servidor estável

   * Deploy interno

   * Logs

Entregável técnico M1:

✅ App navegável com cadastro (ainda sem sync robusto)

✅ Banco central ok

✅ Infra ok

---

### **Trilha B — OPERAÇÃO (sem dev)**

Meta do mês: “montar o método e a documentação”.

1. Desenhar o modelo da consultoria mensal

   * quais indicadores vamos ler

   * como vira relatório

   * qual plano de ação geramos

   * como justificamos mensalidade

      (aqui não precisa sistema pronto, só método claro)

2. Desenhar os módulos de capacitação

   * Bootcamp Previne (por que o dado vale dinheiro)

   * Bootcamp Dashboard (como cobrar equipe)

   * Manual rápido do ACS (1 página)

   * Guia de bolso do coordenador

3. Coletar baseline do município parceiro

   * nota Previne atual

   * relatórios quadrimestre anterior

   * pendências críticas

Entregável operação M1:

✅ Modelo do ritual mensal pronto

✅ Estrutura de treinamento pronta (sem gravação final ainda)

✅ Baseline do município salvo

---

## **MÊS 2 (Dias 31–60) — SINCRONIZAÇÃO \+ DASHBOARD BETA \+ TREINO PILOTO**

### **Trilha A — DEV**

Meta do mês: “fazer o coração bater”.

1. Sync bidirecional funcional

   * fila offline

   * subir produção

   * baixar base microárea

   * resolver conflitos simples

2. Formulários completos

   * cadastro individual completo (7 etapas)

   * cadastro domiciliar completo

   * ficha visita (rápida)

3. Dashboard Beta

   * cobertura cadastral

   * produtividade ACS

   * inconsistências

   * painel inicial Previne (mesmo que simples)

Entregável técnico M2:

✅ App completo \+ sync funcional (beta)

✅ Dashboard beta vivo

---

### **Trilha B — OPERAÇÃO**

Meta do mês: “treinar para testar”.

1. Treinamento piloto com 1 UBS

   * 1 equipe

   * 1 microárea

   * sem pressão, foco em feedback

   * registrar dúvidas reais

2. Criar FAQ de suporte

   * erros comuns

   * roteiros de resposta

   * checklist de sync

3. Ajustar o método com a prática

   * o que funcionou?

   * o que travou?

   * linguagem precisa simplificar?

Entregável operação M2:

✅ Treinamento versão 1 aplicado

✅ FAQ \+ guia rápido atualizados

✅ Lista de melhorias reais para o dev

---

## **MÊS 3 (Dias 61–90) — VALIDAÇÃO REAL \+ POLIMENTO \+ CASE**

### **Trilha A — DEV**

Meta do mês: “transformar beta em produto”.

1. Polimento UX

   * reduzir cliques

   * melhorar cores/status

   * telas rápidas para dia a dia

2. Painel Previne definitivo

   * 7 indicadores

   * drill-down (lista nominal)

   * ranking por UBS/microárea

3. Auditoria/IA leve

   * dedup

   * inconsistências críticas

   * alertas de risco Previne

   * geração de relatório automático

4. Teste de estresse

   * simular vários ACS sincronizando

   * simular falha de rede

   * garantir recuperação

Entregável técnico M3:

✅ MVP final rodando estável

✅ IA leve funcionando

✅ Dashboard completo

---

### **Trilha B — OPERAÇÃO**

Meta do mês: “fechar o método e criar portfólio”.

1. Aplicar rotina mensal real

   * gerar primeiro relatório Previne Nexx

   * apresentar para secretário

   * validar estilo, linguagem, utilidade

2. Criar portfólio

   * prints do painel

   * números “antes x depois”

   * depoimento do município parceiro

3. Finalizar branding e site

   * agora com produto real

   * com dados reais

   * sem promessas vagas

Entregável operação M3:

✅ Ritual mensal validado

✅ Portfólio / case pronto

✅ Branding/website final

---

## **Resultado ao fim do NEXX 90**

Você sai com:

* Produto rodando e testado em campo

* Método de consultoria validado

* Treinamento pronto e testado

* Portfólio real

* Dev não queimado

* Prospecção começa com segurança

---

# **PARTE 2\) NEXX 120 — IMPLANTAÇÃO PADRÃO (para os próximos municípios)**

Agora sim entra o manual clássico de 120 dias, com tudo pronto.

### **MÊS 1 (Dias 1–30) — Diagnóstico e Base**

* auditoria CNES/INE

* instalar conector Nexx

* levantar infra

* relatório baseline

### **MÊS 2 (Dias 31–60) — Treinar e virar cultura**

* workshop Previne

* treino dashboard gestor

* mutirão de saneamento guiado

### **MÊS 3 (Dias 61–90) — Piloto controlado**

* 1 UBS modelo

* operação assistida

* correções finas sem risco

### **MÊS 4 (Dias 91–120) — Go-Live total**

* todas UBS

* Dia D

* primeiro relatório oficial Nexx

* entra rotina mensal

---

# **COMO ISSO PROTEGE O DEV E A OPERAÇÃO**

Você quebra o projeto em dois mundos:

1. Mundo de laboratório (Nexx 90):

    sem pressão, com validação forte.

2. Mundo de escala (Nexx 120):

    produto pronto, método pronto, só execução.

Isso evita o erro clássico govtech:

vender grande sem ter o motor pronto.

---

# **PRÓXIMO PASSO PRÁTICO**

Me diz só isso como decisão interna (não precisa ser pra mim, é pra você organizar a cabeça):

✅ No município parceiro: contrato de validação/lab

* valor menor ou simbólico

* foco em “co-desenvolvimento \+ case”

✅ Nos próximos municípios: contrato comercial cheio

* implantação \+ 24k/mês

* com portfólio e método na mão

Boa. Isso é a diferença entre “projeto bonito” e “projeto que sobrevive ao mundo real do governo”.

A chave é: no contrato você não finge que o produto já está 100% pronto, você formaliza a entrega progressiva e cria um mecanismo legal que impede o município de te travar.

Governo folga porque contrato fraco deixa. Contrato forte organiza o tempo.

Vou te passar a estrutura correta de como declarar isso no contrato/TR de forma auditável pelo TCE e segura pra Nexx.

---

# **COMO DECLARAR NO CONTRATO SEM SER “PROMESSA VAZIA”**

## **1\) Deixa claro o modelo:** 

## **Programa de Modernização \+ Entrega Progressiva**

No objeto do contrato, nada de “compra de sistema pronto”.

Você vende serviço continuado \+ licenciamento progressivo.

Texto sugerido pro Objeto:

“Contratação de solução de Inteligência de Dados e Modernização da Atenção Primária à Saúde (SaaS), com implantação assistida, capacitação técnica, saneamento de base cadastral, integração com sistemas oficiais do Ministério da Saúde e entrega progressiva de módulos tecnológicos ao longo de 120 dias, seguido de operação assistida e consultoria continuada por 12 meses.”

Isso dá base pra você cobrar desde o dia 1 sem depender do app final.

---

## **2\) Cria a** 

## **Cláusula de Marco Zero (anti-folga)**

Essa cláusula é ouro.

Ideia: o prazo técnico só começa quando eles entregarem dados mínimos.

Se não entregarem, o cronograma congela, mas a cobrança não.

Texto sugerido:

“A contagem do prazo de implantação (120 dias) terá início após o Aceite Formal de Recebimento dos Dados Iniciais obrigatórios, descritos no Anexo I. A ausência ou atraso na entrega destes dados suspenderá automaticamente o cronograma técnico, sem suspensão de faturamento referente aos serviços de consultoria, capacitação e saneamento de base, previstos em contrato.”

Pronto. Se a prefeitura enrolar, ela se auto-culpa.

---

## **3\) Define** 

## **Responsabilidades do Município**

##  **(checklist obrigatório)**

Sem isso vocês viram reféns.

Anexo I — Dados/condições que eles têm que entregar em até 7 dias

* Base CNES atualizada

* Lista INE das equipes

* Lista nominal de ACS (CPF, CNS, microárea)

* Mapa territorial/microáreas

* Relatórios do e-Gestor Previne (últimos 2 quadrimestres)

* Acesso ao PEC ou exportação de base CDS

Cláusula sugerida:

“O CONTRATANTE compromete-se a disponibilizar as informações e acessos descritos no Anexo I no prazo máximo de 7 (sete) dias úteis, sob pena de suspensão do cronograma técnico, sem prejuízo dos pagamentos.”

---

## **4\) Divide a implantação em** 

## **Fases com Entregáveis Auditáveis**

Você já desenhou isso no Nexx 120\. Agora vira cláusula.

### **Fase 1 — Diagnóstico \+ Infra \+ Saneamento (Dias 1–30)**

Entregáveis:

* Relatório Diagnóstico Situacional (com fotos/infra)

* Relatório CNES/INE (vínculos corrigidos)

* Relatório de Saneamento de Base (Previne)

* Conector Nexx instalado

NF do mês 1 \= consultoria \+ diagnóstico \+ dados.

### **Fase 2 — Capacitação \+ Piloto (Dias 31–60)**

Entregáveis:

* Bootcamp Previne Brasil (lista presença \+ certificados)

* Treino operacional do fluxo ACS/UBS

* App beta funcionando em UBS piloto

* Relatório de feedback do piloto

NF mês 2 \= capacitação \+ implantação assistida.

### **Fase 3 — Dashboard \+ Integração (Dias 61–90)**

Entregáveis:

* Dashboard beta \+ painel Previne

* Primeiros indicadores gerados

* Integração PEC/CDS em validação

* Relatório comparativo parcial

### **Fase 4 — Go-Live total (Dias 91–120)**

Entregáveis:

* App \+ Dashboard em todas UBS

* Dia D de virada

* Primeiro relatório oficial Nexx

* Termo de aceite de operação plena

Depois disso entra a recorrência.

---

## **5\) Termo de Aceite por fase (não só no final)**

Cada fase tem um aceite automático.

Cláusula sugerida:

“Ao final de cada fase, será emitido Relatório de Entrega correspondente. Caso o CONTRATANTE não manifeste objeção formal em até 10 dias úteis, considerar-se-á a fase automaticamente aceita para fins de faturamento e continuidade do projeto.”

Isso evita “gestor sumiu, não assinou, não paga”.

---

## **6\) Define o que é** 

## **MVP**

##  **e o que é** 

## **Evolução**

Aqui você protege o dev de escopo infinito.

Anexo II — Escopo MVP

* App ACS: cadastro individual/domiciliar/visita \+ offline \+ sync

* Dashboard gestor: cobertura, produtividade, inconsistências, Previne

* Integração e-SUS: exportação XML/Thrift compatível

* IA leve: auditoria e alertas Previne básicos

Cláusula:

“Funcionalidades não previstas no Anexo II serão consideradas evolução e deverão ser contratadas por termo aditivo, sem obrigação de entrega no cronograma MVP.”

---

## **7\) Precificação contratual correta**

Como vocês ainda estão no laboratório interno, mas vendem para o cliente como entrega progressiva:

* Implantação (setup) \= fases 1–4

* Recorrência (SaaS \+ consultoria) começa após Go-Live

   (ou a partir do mês 2 se quiser, mas aí tem que declarar “consultoria continuada já ativa”).

Você define claro:

Cláusula financeira simples:

“O pagamento da implantação ocorrerá em 4 parcelas mensais iguais, vinculadas às fases de entrega. A mensalidade recorrente inicia-se a partir do aceite da Fase 4 (Go-Live), permanecendo por 12 meses.”

Isso alinha caixa e evita discussão.

---

# **CONCLUSÃO PRÁTICA (pra você levar pros sócios)**

Você não vai “fingir produto pronto”.

Você vai contratualizar uma modernização progressiva, com:

✅ Marco zero por entrega de dados

✅ Suspensão de cronograma sem suspender faturamento

✅ Fases com entregáveis auditáveis

✅ Aceite automático se gestor enrolar

✅ MVP fechado \+ evolução por aditivo

✅ Pagamento por fase \+ recorrência pós go-live

Isso é modelo 100% defensável no TCE e protege vocês do “município folgando”.

* Lista INE das equipes

* Lista nominal de ACS (CPF, CNS, microárea)

* Mapa territorial/microáreas

* Relatórios do e-Gestor Previne (últimos 2 quadrimestres)

* Acesso ao PEC ou exportação de base CDS

Cláusula sugerida:

“O CONTRATANTE compromete-se a disponibilizar as informações e acessos descritos no Anexo I no prazo máximo de 7 (sete) dias úteis, sob pena de suspensão do cronograma técnico, sem prejuízo dos pagamentos.”

---

## **4\) Divide a implantação em** 

## **Fases com Entregáveis Auditáveis**

Você já desenhou isso no Nexx 120\. Agora vira cláusula.

### **Fase 1 — Diagnóstico \+ Infra \+ Saneamento (Dias 1–30)**

Entregáveis:

* Relatório Diagnóstico Situacional (com fotos/infra)

* Relatório CNES/INE (vínculos corrigidos)

* Relatório de Saneamento de Base (Previne)

* Conector Nexx instalado

NF do mês 1 \= consultoria \+ diagnóstico \+ dados.

### **Fase 2 — Capacitação \+ Piloto (Dias 31–60)**

Entregáveis:

* Bootcamp Previne Brasil (lista presença \+ certificados)

* Treino operacional do fluxo ACS/UBS

* App beta funcionando em UBS piloto

* Relatório de feedback do piloto

NF mês 2 \= capacitação \+ implantação assistida.

### **Fase 3 — Dashboard \+ Integração (Dias 61–90)**

Entregáveis:

* Dashboard beta \+ painel Previne

* Primeiros indicadores gerados

* Integração PEC/CDS em validação

* Relatório comparativo parcial

### **Fase 4 — Go-Live total (Dias 91–120)**

Entregáveis:

* App \+ Dashboard em todas UBS

* Dia D de virada

* Primeiro relatório oficial Nexx

* Termo de aceite de operação plena

Depois disso entra a recorrência.

---

## **5\) Termo de Aceite por fase (não só no final)**

Cada fase tem um aceite automático.

Cláusula sugerida:

“Ao final de cada fase, será emitido Relatório de Entrega correspondente. Caso o CONTRATANTE não manifeste objeção formal em até 10 dias úteis, considerar-se-á a fase automaticamente aceita para fins de faturamento e continuidade do projeto.”

Isso evita “gestor sumiu, não assinou, não paga”.

* 

