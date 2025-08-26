# 🚀 To-Do List Conversacional com IA

Uma aplicação SaaS moderna que permite capturar tarefas via texto/áudio, processar automaticamente com agentes de IA, organizar por projetos/clientes, e gerenciar através de interface chat + visual.

## ✨ Funcionalidades

- **🤖 Agentes de IA Inteligentes**: 4 agentes especializados (Intake, Linker, Planner, Prioritizer)
- **🎤 Captura por Áudio**: Transcrição automática com OpenAI Whisper
- **💬 Interface Conversacional**: Chat natural para criar e gerenciar tarefas
- **📊 Visualizações Múltiplas**: Lista, Kanban e Timeline
- **🏢 Organização por Workspaces**: Pessoal e clientes separados
- **⚡ Priorização Automática**: Baseada em SLA, prazos e contexto
- **📱 Interface Moderna**: Design responsivo com Tailwind CSS

## 🛠️ Stack Técnica

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Supabase (Postgres + Auth + Realtime + pgvector)
- **IA**: OpenAI GPT-4o (compreensão) + Whisper (áudio)
- **Estado**: Zustand + SWR
- **Deploy**: Vercel

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone <repository-url>
cd todo-ai-saas
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure as variáveis de ambiente
```bash
cp .env.local.example .env.local
```

Edite o arquivo `.env.local` com suas credenciais:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# OpenAI
OPENAI_API_KEY=your_openai_api_key_here
```

### 4. Execute o projeto
```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🎯 Como Usar

### 1. Captura Rápida
Digite ou grave uma mensagem como:
- "Cliente Kabbatec precisa de orçamento para Academia SP até sexta"
- "Lembrar de renovar CNH até fim do mês"
- "Marcar consulta médica para próxima semana"

### 2. Interface Conversacional
- Use o chat para criar, atualizar e gerenciar tarefas
- Grave áudio segurando o botão do microfone
- O sistema processa automaticamente com IA

### 3. Visualizações
- **Lista**: Visão tradicional das tarefas
- **Kanban**: Organização por status (A fazer, Em andamento, Concluído)
- **Timeline**: Visualização temporal por prazo

## 📁 Estrutura do Projeto

```
/src
  /app                  # Next.js App Router
    /api                # API routes
      /ai               # Endpoints IA
      /tasks           # CRUD tarefas
      /audio           # Upload/transcrição
  /components
    /chat              # Interface conversacional  
    /dashboard         # UI principal
    /tasks             # Lista/Kanban tarefas
  /lib
    /ai                # Agentes IA
    /supabase          # Cliente DB
    /utils             # Helpers
  /types               # TypeScript types
```

## 🚀 Deploy

### Vercel
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

## 📝 Licença

MIT License - veja o arquivo LICENSE para detalhes.
