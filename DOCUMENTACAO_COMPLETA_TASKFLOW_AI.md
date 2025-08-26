# TaskFlow AI - Documentação Completa

## Visão Geral

O TaskFlow AI é um sistema inteligente de gerenciamento de tarefas que utiliza múltiplos agentes de IA para automatizar a criação, organização e priorização de tarefas. O sistema é construído com Next.js, Supabase e OpenAI, oferecendo uma experiência completa de produtividade.

## Estrutura do Projeto

### Organização de Diretórios

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   │   ├── ai/process/    # Processamento de IA
│   │   ├── audio/transcribe/ # Transcrição de áudio
│   │   └── tasks/         # CRUD de tarefas
│   ├── dashboard/         # Dashboard principal
│   ├── globals.css        # Estilos globais
│   ├── layout.tsx         # Layout raiz
│   └── page.tsx           # Página inicial
├── components/            # Componentes React
│   ├── 3d/               # Componentes 3D (Three.js)
│   │   └── ProductivityBackground3D.tsx
│   ├── chat/             # Interface de chat
│   │   ├── ChatHeader.tsx
│   │   ├── ChatInput.tsx
│   │   └── ChatMessages.tsx
│   ├── dashboard/        # Componentes do dashboard
│   │   ├── ChatInterface.tsx
│   │   ├── CreateTaskModal.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── MainDashboard.tsx
│   │   ├── ProjectList.tsx
│   │   ├── Sidebar.tsx
│   │   ├── StatsCards.tsx
│   │   ├── TaskBoard.tsx
│   │   └── WorkspaceSelector.tsx
│   ├── shared/           # Componentes compartilhados
│   │   ├── LoadingSpinner.tsx
│   │   └── ParticlesBackground.tsx
│   ├── tasks/            # Componentes de tarefas
│   │   ├── TaskCard.tsx
│   │   ├── TaskKanban.tsx
│   │   ├── TaskList.tsx
│   │   ├── TaskTimeline.tsx
│   │   └── TaskViewSwitcher.tsx
│   └── ui/               # Componentes de UI base
│       └── GlassCard.tsx
├── lib/                  # Lógica de negócio
│   ├── ai/               # Sistema de agentes IA
│   │   ├── agents.ts     # Agentes individuais
│   │   ├── langgraph-agents.ts # Sistema LangGraph
│   │   ├── chat-service.ts # Serviço de chat
│   │   └── openai-client.ts # Cliente OpenAI
│   ├── services/         # Serviços de dados
│   │   ├── embedding-service.ts # Busca semântica
│   │   └── task-service.ts # CRUD de tarefas
│   ├── supabase/         # Configuração Supabase
│   │   ├── client.ts     # Cliente Supabase
│   │   └── migrations/   # Migrações do banco
│   │       └── 001_initial_schema.sql
│   ├── business-rules.ts # Regras de negócio
│   ├── mock-data.ts      # Dados de teste
│   ├── store.ts          # Estado global (Zustand)
│   └── utils.ts          # Utilitários
├── types/                # Definições TypeScript
│   └── index.ts
└── middleware.ts         # Middleware de autenticação
```

## Funcionalidades Principais

### 1. Interface de Usuário

#### Dashboard Principal
- **Layout Responsivo**: Interface moderna com sidebar e área principal
- **Navegação Intuitiva**: Dashboard, Chat, Calendar e Settings
- **Seleção de Workspaces**: Suporte a múltiplos ambientes (Personal, NTEX, Kabbatec)
- **Estatísticas em Tempo Real**: Cards com métricas de tarefas
- **Background 3D**: Elementos visuais interativos com Three.js

#### Chat Interface
- **Conversação Natural**: Interface de chat para interação com IA
- **Histórico de Mensagens**: Persistência de conversas
- **Entrada por Voz**: Botão de microfone para transcrição de áudio
- **Respostas Inteligentes**: Processamento automático de solicitações

#### Task Board (Kanban)
- **Visualização Kanban**: Colunas To Do, In Progress, Done
- **Drag & Drop**: Movimentação de tarefas entre status
- **Filtros Avançados**: Por prioridade, status e busca textual
- **Estatísticas Visuais**: Contadores por coluna

#### Componentes 3D e Visuais
- **ProductivityBackground3D**: Background interativo com Three.js
- **ParticlesBackground**: Efeitos de partículas
- **GlassCard**: Cards com efeito glassmorphism
- **LoadingSpinner**: Indicadores de carregamento

### 2. Gerenciamento de Tarefas

#### Criação Inteligente
- **Múltiplas Fontes**: Manual, áudio, WhatsApp, email, chat IA
- **Processamento Automático**: Conversão de entrada natural em tarefas estruturadas
- **Subtarefas Automáticas**: Decomposição inteligente em passos menores
- **Priorização Automática**: Definição de prioridade baseada em contexto

#### Organização
- **Workspaces**: Separação por ambiente de trabalho
- **Projetos**: Agrupamento de tarefas relacionadas
- **Entidades**: Clientes, pessoas e tags para categorização
- **Status Tracking**: Acompanhamento de progresso

#### Busca e Filtros
- **Busca Textual**: Pesquisa por título e descrição
- **Busca Semântica**: Encontra tarefas similares usando embeddings
- **Filtros Múltiplos**: Por status, prioridade, projeto, cliente
- **Ordenação**: Por data, prioridade, esforço estimado

### 3. Processamento de Áudio

#### Transcrição Inteligente
- **Whisper Integration**: Transcrição de áudio para texto
- **Suporte a Português**: Otimizado para idioma brasileiro
- **Processamento Automático**: Conversão direta em tarefas
- **Formato Flexível**: Suporte a múltiplos formatos de áudio

#### Conversão para Tarefas
- **Análise de Intenção**: Identificação do tipo de solicitação
- **Extração de Entidades**: Clientes, datas, prioridades
- **Criação Automática**: Geração de tarefas estruturadas

## Arquitetura dos Agentes de IA

### 1. Sistema de Agentes Multi-Especialistas

O TaskFlow AI utiliza uma arquitetura de agentes especializados que trabalham em conjunto para processar entradas do usuário. O sistema implementa duas abordagens:

#### Implementação Principal: `src/lib/ai/agents.ts`
Sistema de agentes individuais com orquestração manual:

#### 1.1 Intake Agent (Agente de Entrada)
**Função**: Analisa e estrutura a entrada inicial do usuário

**Processamento**:
- Extrai intenção (criar, atualizar, completar, questionar)
- Identifica entidades (clientes, pessoas, datas, projetos)
- Determina ação principal (verbo + objeto)
- Estima prioridade inicial
- Calcula confiança da análise

**Entrada**: Texto natural do usuário
**Saída**: `ParsedInput` estruturado com metadados

**Exemplo de Processamento**:
```
Entrada: "Preciso criar um relatório para o cliente NTEX até sexta-feira"
Saída: {
  intention: "task_new",
  action: "criar relatório",
  entities: [
    { type: "client", value: "NTEX" },
    { type: "date", value: "sexta-feira" }
  ],
  priority: 2,
  confidence: 0.85
}
```

#### 1.2 Linker Agent (Agente de Vinculação)
**Função**: Decide se deve criar nova tarefa ou vincular a existente

**Processamento**:
- Analisa similaridade com tarefas existentes
- Considera contexto temporal e de projeto
- Decide entre criar nova, anexar ou editar
- Fornece justificativa da decisão

**Entrada**: `ParsedInput` + lista de tarefas existentes
**Saída**: `LinkDecision` com decisão e target_task_id

**Lógica de Decisão**:
- **create_new**: Tarefa independente e única
- **attach_to**: Complementa tarefa existente
- **edit_existing**: Atualiza tarefa existente

#### 1.3 Planner Agent (Agente de Planejamento)
**Função**: Cria plano detalhado com subtarefas

**Processamento**:
- Decompõe tarefa em subtarefas lógicas
- Define ordem de execução
- Estima esforço total
- Cria critérios de conclusão

**Entrada**: Dados da tarefa + decisão do linker
**Saída**: `TaskPlan` com subtarefas estruturadas

**Exemplo de Decomposição**:
```
Tarefa: "Criar relatório mensal"
Subtarefas:
1. Coletar dados de vendas
2. Analisar métricas principais
3. Criar gráficos e tabelas
4. Escrever análise textual
5. Revisar e finalizar
```

#### 1.4 Prioritizer Agent (Agente de Priorização)
**Função**: Define prioridade final e prazo sugerido

**Processamento**:
- Analisa contexto do usuário (SLA, agenda, carga)
- Considera urgência e impacto
- Sugere data de entrega
- Justifica decisão de prioridade

**Entrada**: `TaskPlan` + contexto do usuário
**Saída**: `PriorityDecision` com prioridade e prazo

**Fatores de Priorização**:
- **SLA do Cliente**: Prazos contratuais
- **Urgência**: Proximidade temporal
- **Impacto**: Valor/receita envolvida
- **Capacidade**: Carga atual do usuário

#### Implementação Alternativa: `src/lib/ai/langgraph-agents.ts`
Sistema baseado em LangGraph com estado compartilhado:

**Estado Compartilhado**:
```typescript
interface AgentState {
  input: string;
  parsedInput?: ParsedInput;
  existingTasks: Task[];
  linkDecision?: LinkDecision;
  taskPlan?: TaskPlan;
  priorityDecision?: PriorityDecision;
  finalTask?: Task;
  userContext?: any;
  errors: string[];
  confidence: number;
}
```

**Fluxo de Processamento**:
```typescript
export async function processUserInput(
  input: string,
  existingTasks: Task[] = [],
  workspaceId: string = '',
  userContext?: any
): Promise<AgentState>
```

### 2. Fluxo de Processamento

```
Entrada do Usuário
       ↓
   Intake Agent
       ↓
   Linker Agent
       ↓
   Planner Agent
       ↓
  Prioritizer Agent
       ↓
   Finalizer Agent
       ↓
   Tarefa Criada
```

### 3. Sistema de Confiança

Cada agente retorna um score de confiança (0.0-1.0):
- **0.9-1.0**: Alta confiança, execução automática
- **0.7-0.9**: Confiança moderada, pode requerer confirmação
- **0.5-0.7**: Baixa confiança, sempre requer confirmação
- **<0.5**: Falha no processamento, modo fallback

## Integração com Banco de Dados

### 1. Schema do Banco (Supabase/PostgreSQL)

#### Tabelas Principais

**users**
- Extensão do auth.users do Supabase
- Preferências personalizadas
- Dados de perfil

**workspaces**
- Ambientes de trabalho (Personal, Cliente)
- Configurações específicas
- Relacionamento 1:N com usuários

**projects**
- Agrupamento de tarefas relacionadas
- SLA do cliente em horas
- Status ativo/inativo

**tasks**
- Entidade central do sistema
- Campos para IA (source_type, ai_confidence)
- Embeddings para busca semântica
- Relacionamentos com workspace e projeto

**subtasks**
- Decomposição de tarefas
- Ordem de execução
- Status independente

**entities**
- Clientes, pessoas, tags
- Metadados flexíveis
- Categorização de tarefas

**chat_messages**
- Histórico de conversas
- Ações realizadas pela IA
- Metadados de processamento

#### Tabelas de Suporte

**task_entities**
- Relacionamento N:N entre tarefas e entidades
- Permite múltiplas categorizações

**ai_agent_logs**
- Logs de execução dos agentes
- Métricas de performance
- Debugging e otimização

**user_context**
- Contexto para decisões de IA
- Dados de agenda, SLA, carga de trabalho
- Cache temporal de informações

### 2. Operações de Banco

#### Criação de Tarefa
```sql
-- 1. Inserir tarefa principal
INSERT INTO tasks (workspace_id, title, description, priority, ...)
VALUES (...);

-- 2. Inserir subtarefas
INSERT INTO subtasks (task_id, title, order_index, ...)
VALUES (...);

-- 3. Vincular entidades
INSERT INTO task_entities (task_id, entity_id)
VALUES (...);

-- 4. Registrar mensagem de chat
INSERT INTO chat_messages (user_id, workspace_id, content, action)
VALUES (...);
```

#### Busca Semântica
```sql
-- Usar embeddings para encontrar tarefas similares
SELECT id, title, description, 
       1 - (embedding <=> query_embedding) AS similarity
FROM tasks 
WHERE workspace_id = $1 
  AND 1 - (embedding <=> query_embedding) > 0.7
ORDER BY embedding <=> query_embedding
LIMIT 10;
```

#### Estatísticas em Tempo Real
```sql
-- Contadores por status e prioridade
SELECT 
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE status = 'todo') as todo,
  COUNT(*) FILTER (WHERE status = 'in_progress') as in_progress,
  COUNT(*) FILTER (WHERE priority = 1) as high_priority
FROM tasks 
WHERE workspace_id = $1;
```

### 3. Segurança e Performance

#### Row Level Security (RLS)
- Políticas por usuário e workspace
- Isolamento completo de dados
- Controle granular de acesso

#### Índices Otimizados
- Índices compostos para consultas frequentes
- Índice vectorial para busca semântica
- Índices parciais para filtros comuns

#### Triggers Automáticos
- Atualização automática de timestamps
- Criação de workspace padrão
- Validações de integridade

## APIs e Integrações

### 1. API Routes (Next.js)

#### `/api/ai/process`
**POST**: Processa entrada do usuário
- Autenticação via token Supabase
- Processamento através dos agentes
- Retorna tarefa criada e resposta

**GET**: Obtém histórico de chat
- Filtrado por workspace
- Paginação configurável
- Ordenação por timestamp

#### `/api/audio/transcribe`
**POST**: Transcreve áudio para texto
- Integração com OpenAI Whisper
- Suporte a múltiplos formatos
- Otimizado para português

#### `/api/tasks`
**CRUD completo** para tarefas:
- GET: Listar com filtros
- POST: Criar nova tarefa
- PUT: Atualizar existente
- DELETE: Remover tarefa

### 2. Serviços de IA

#### Chat Service (`src/lib/ai/chat-service.ts`)
- Orquestração dos agentes
- Gerenciamento de contexto
- Persistência de conversas

#### Task Service (`src/lib/services/task-service.ts`)
- Operações CRUD de tarefas
- Estatísticas e relatórios
- Busca e filtros avançados

#### Embedding Service (`src/lib/services/embedding-service.ts`)
- Geração de embeddings
- Busca semântica
- Similaridade de conteúdo

### 3. Integrações Externas

#### OpenAI
- **GPT-4o**: Processamento de linguagem natural
- **Whisper**: Transcrição de áudio
- **Embeddings**: Representação vetorial de texto

#### Supabase
- **Auth**: Autenticação e autorização
- **Database**: PostgreSQL com RLS
- **Storage**: Arquivos de áudio
- **Realtime**: Atualizações em tempo real

## Estado Global e Gerenciamento

### Zustand Store (`src/lib/store.ts`)
```typescript
interface AppState {
  // Estado do usuário
  user: User | null;
  workspace: Workspace | null;
  
  // Estado das tarefas
  tasks: Task[];
  selectedTask: Task | null;
  
  // Estado do chat
  chatHistory: ChatMessage[];
  isLoading: boolean;
  
  // Ações
  setUser: (user: User | null) => void;
  setWorkspace: (workspace: Workspace | null) => void;
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
}
```

## Funcionalidades Avançadas

### 1. Busca Semântica
- Embeddings de tarefas e consultas
- Encontra tarefas similares por significado
- Melhora descoberta de conteúdo relacionado

### 2. Contexto Inteligente
- Análise de carga de trabalho atual
- Consideração de SLA de clientes
- Integração com agenda do usuário

### 3. Aprendizado Contínuo
- Logs de execução dos agentes
- Métricas de acurácia
- Otimização baseada em feedback

### 4. Multi-modalidade
- Entrada por texto, áudio, WhatsApp, email
- Processamento unificado
- Conversão automática entre formatos

### 5. Elementos Visuais 3D
- Background interativo com Three.js
- Efeitos de partículas
- Animações suaves com Framer Motion
- Cards com efeito glassmorphism

## Monitoramento e Analytics

### 1. Logs de Agentes
- Tempo de execução por agente
- Taxa de sucesso
- Erros e exceções

### 2. Métricas de Usuário
- Tarefas criadas por fonte
- Tempo médio de conclusão
- Uso de funcionalidades

### 3. Performance do Sistema
- Latência de resposta
- Uso de recursos
- Disponibilidade

## Configuração e Deploy

### 1. Variáveis de Ambiente
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

# OpenAI Configuration
OPENAI_API_KEY=sua_chave_openai
```

### 2. Dependências Principais
```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/auth-helpers-nextjs": "^0.9.0",
    "openai": "^5.15.0",
    "@langchain/core": "^0.3.72",
    "@langchain/langgraph": "^0.4.6",
    "@langchain/openai": "^0.6.9",
    "next": "^15.5.0",
    "react": "^19.1.1",
    "framer-motion": "^12.23.12",
    "three": "^0.179.1",
    "@react-three/fiber": "^9.3.0",
    "@react-three/drei": "^10.7.4",
    "zustand": "^5.0.8"
  }
}
```

## Roadmap e Melhorias

### 1. Próximas Funcionalidades
- Integração com calendário externo
- Notificações inteligentes
- Relatórios avançados
- Colaboração em equipe
- Exportação de dados

### 2. Otimizações Técnicas
- Cache inteligente
- Processamento em lote
- Otimização de prompts
- Redução de latência
- Lazy loading de componentes

### 3. Expansão de Agentes
- Agente de Análise de Tendências
- Agente de Otimização de Fluxo
- Agente de Recomendações
- Agente de Automação
- Agente de Relatórios

### 4. Melhorias de UI/UX
- Temas personalizáveis
- Modo escuro/claro
- Animações mais fluidas
- Responsividade aprimorada
- Acessibilidade

## Conclusão

O TaskFlow AI representa uma evolução significativa no gerenciamento de tarefas, combinando interface intuitiva com processamento inteligente de IA. A arquitetura modular de agentes permite processamento sofisticado de entrada natural, enquanto a integração robusta com Supabase garante escalabilidade e segurança.

O sistema é projetado para crescer com as necessidades do usuário, oferecendo tanto funcionalidades básicas quanto recursos avançados de IA, tudo integrado em uma experiência de usuário coesa e produtiva com elementos visuais modernos e interativos.
