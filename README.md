# 🎯 TaskFlow AI - Intelligent Task Management

Um sistema premium de gerenciamento de tarefas com inteligência artificial, interface glassmorphism e processamento de linguagem natural.

## ✨ Características Premium

### 🎨 Interface Premium
- **Glassmorphism Design**: Efeitos de vidro translúcido com blur e transparência
- **Partículas Animadas**: Background interativo com partículas conectadas
- **Gradientes Dinâmicos**: Overlays de gradiente animados
- **Micro-interações**: Animações suaves e feedback visual
- **Tema Escuro**: Design moderno com paleta escura premium

### 🤖 Inteligência Artificial
- **4 Agentes de IA Especializados**:
  - **Intake Agent**: Parser de entrada natural
  - **Linker Agent**: Vinculação inteligente de tarefas
  - **Planner Agent**: Decomposição em subtarefas
  - **Prioritizer Agent**: Priorização automática
- **Processamento de Linguagem Natural**: Entrada por texto e voz
- **Transcrição de Áudio**: Integração com Whisper AI
- **Organização Automática**: Criação inteligente de tarefas

### 📊 Dashboard Funcional
- **Kanban Board**: Visualização drag & drop de tarefas
- **Estatísticas em Tempo Real**: Métricas de produtividade
- **Filtros Avançados**: Busca por prioridade e status
- **Modal de Criação**: Interface premium para novas tarefas
- **Chat Conversacional**: Interface de IA integrada

## 🚀 Tecnologias

- **Frontend**: Next.js 15, React 19, TypeScript
- **Estilização**: Tailwind CSS, Glassmorphism
- **Animações**: Framer Motion
- **IA**: OpenAI GPT-5, Whisper
- **Backend**: Next.js API Routes
- **Banco de Dados**: Supabase (configurado)
- **Ícones**: Lucide React

## 📁 Estrutura do Projeto

```
src/
├── app/
│   ├── dashboard/
│   │   ├── layout.tsx          # Layout premium com glassmorphism
│   │   └── page.tsx            # Dashboard principal
│   ├── api/
│   │   ├── ai/process/         # Pipeline de agentes IA
│   │   ├── audio/transcribe/   # Transcrição Whisper
│   │   └── tasks/              # CRUD de tarefas
│   └── page.tsx                # Redirecionamento para dashboard
├── components/
│   ├── ui/
│   │   └── GlassCard.tsx       # Componente base glassmorphism
│   ├── shared/
│   │   ├── ParticlesBackground.tsx  # Efeitos de partículas
│   │   └── LoadingSpinner.tsx       # Spinner animado
│   └── dashboard/
│       ├── Sidebar.tsx         # Navegação premium
│       ├── ChatInterface.tsx   # Chat com IA
│       ├── TaskBoard.tsx       # Kanban board
│       ├── CreateTaskModal.tsx # Modal de criação
│       └── DashboardStats.tsx  # Estatísticas
└── lib/
    ├── ai/agents.ts            # 4 agentes de IA
    └── utils.ts                # Utilitários
```

## 🛠️ Instalação

1. **Clone o repositório**:
```bash
git clone <repository-url>
cd Tod
```

2. **Instale as dependências**:
```bash
npm install
```

3. **Configure as variáveis de ambiente**:
```bash
cp .env.local.example .env.local
```

Edite o `.env.local` com suas chaves:
```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_api_key
```

4. **Execute o projeto**:
```bash
npm run dev
```

Acesse: http://localhost:3000

## 🎯 Funcionalidades Implementadas

### ✅ Dashboard Premium
- Layout com glassmorphism e partículas
- Sidebar animada com workspaces
- Estatísticas em tempo real
- Kanban board funcional

### ✅ Sistema de IA
- Pipeline completo de 4 agentes
- Processamento de linguagem natural
- API de transcrição de áudio
- Criação inteligente de tarefas

### ✅ Interface de Chat
- Chat conversacional com IA
- Processamento em tempo real
- Indicadores de status
- Interface premium

### ✅ Gerenciamento de Tarefas
- CRUD completo via API
- Drag & drop entre colunas
- Filtros e busca
- Modal de criação premium

## 🔧 Configuração de IA

O sistema utiliza 4 agentes especializados:

1. **Intake Agent**: Analisa entrada do usuário e extrai intenções
2. **Linker Agent**: Decide se criar nova tarefa ou vincular a existente
3. **Planner Agent**: Decompoe tarefas em subtarefas
4. **Prioritizer Agent**: Define prioridade baseada em contexto

## 🎨 Design System

### Cores Premium
- **Background**: `#0f172a` (slate-950)
- **Glassmorphism**: `rgba(255, 255, 255, 0.05)`
- **Gradientes**: Blue-500 → Purple-600
- **Acentos**: Blue-400, Green-400, Yellow-400, Red-400

### Componentes Base
- **GlassCard**: Efeito glassmorphism reutilizável
- **ParticlesBackground**: Partículas animadas
- **LoadingSpinner**: Spinner com gradiente

## 🚀 Próximos Passos

- [ ] Implementar autenticação Supabase
- [ ] Adicionar landing page premium
- [ ] Implementar gravação de áudio
- [ ] Adicionar notificações push
- [ ] Implementar sincronização em tempo real

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.

---

**TaskFlow AI** - Transformando a produtividade com IA 🤖✨
