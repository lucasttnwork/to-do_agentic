# TaskFlow AI - Intelligent Task Management

## 🚀 Sistema Inteligente de Gerenciamento de Tarefas

### 📋 Visão Geral
TaskFlow AI é uma plataforma de gerenciamento de tarefas inteligente que utiliza múltiplos agentes de IA para criar, organizar e priorizar tarefas automaticamente a partir de conversas naturais, áudio e outras fontes.

### 🎯 Funcionalidades Principais
- **Chat Inteligente**: Conversa natural com IA para criar tarefas
- **Agentes Especializados**: 5 agentes IA para diferentes aspectos do gerenciamento
- **Dashboard Moderno**: Interface responsiva com elementos visuais
- **Autenticação**: Sistema completo de login/logout
- **Workspaces**: Múltiplos espaços de trabalho
- **Priorização Automática**: IA define prioridades baseada em contexto
- **Processamento de Áudio**: Transcrição automática com Whisper
- **Busca Semântica**: Encontra tarefas similares usando embeddings

### 🔧 Configuração Rápida

#### **Passo 1: Configurar Banco de Dados**

1. **Acesse o Supabase Dashboard**
   - Vá para: https://supabase.com/dashboard
   - Selecione seu projeto

2. **Aplicar Migração**
   - Vá para **SQL Editor**
   - Cole o conteúdo do arquivo: `src/lib/supabase/migrations/001_initial_schema.sql`
   - Execute a query

#### **Passo 2: Configurar Variáveis de Ambiente**

1. **Copiar .env.local.example**
   ```bash
   cp .env.local.example .env.local
   ```

2. **Configurar chaves**
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=sua_url_supabase
   NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima
   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role

   # OpenAI Configuration
   OPENAI_API_KEY=sua_chave_openai
   ```

#### **Passo 3: Instalar e Executar**

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

### 🏗️ Estrutura do Projeto

#### **Arquivos Principais**
- `src/lib/supabase/migrations/001_initial_schema.sql` - Schema do banco
- `src/lib/ai/langgraph-agents.ts` - Sistema de agentes IA
- `src/lib/ai/chat-service.ts` - Serviço de chat
- `src/app/api/ai/process/route.ts` - API endpoint
- `src/app/dashboard/page.tsx` - Dashboard principal

#### **Componentes**
- `src/components/dashboard/MainDashboard.tsx` - Dashboard principal
- `src/components/chat/ChatInterface.tsx` - Interface de chat
- `src/components/tasks/TaskBoard.tsx` - Board Kanban
- `src/components/ui/GlassCard.tsx` - Cards com efeito glass

### 🧠 Sistema de Agentes IA

#### **Fluxo de Processamento**
```
Usuário → Intake Agent → Linker Agent → Planner Agent → Prioritizer Agent → Finalizer Agent → Tarefa Criada
```

#### **Agentes Especializados**
1. **Intake Agent**: Extrai informações da mensagem
2. **Linker Agent**: Conecta com entidades existentes
3. **Planner Agent**: Cria plano de execução
4. **Prioritizer Agent**: Define prioridades
5. **Finalizer Agent**: Finaliza e salva a tarefa

### 📊 Estrutura de Dados

#### **Tabelas Principais**
- `users` - Usuários do sistema
- `workspaces` - Espaços de trabalho
- `projects` - Projetos
- `tasks` - Tarefas principais
- `subtasks` - Subtarefas
- `entities` - Entidades (clientes, pessoas, tags)
- `chat_messages` - Histórico de conversas
- `ai_agent_logs` - Logs de execução

### 🔐 Autenticação

#### **Configurar Providers**
1. No Supabase Dashboard, vá para **Authentication > Providers**
2. Configure:
   - Google OAuth
   - GitHub OAuth
   - Email/Password

#### **Proteção de Rotas**
- Todas as rotas do dashboard são protegidas
- RLS (Row Level Security) configurado no banco
- Sessões gerenciadas automaticamente

### 🎨 Interface

#### **Tecnologias Utilizadas**
- **Next.js 14**: Framework React
- **Tailwind CSS**: Estilização
- **Framer Motion**: Animações
- **Supabase**: Backend e autenticação
- **OpenAI**: Processamento de IA

#### **Características**
- Interface responsiva
- Design moderno e intuitivo
- Animações suaves
- Suporte a temas escuro/claro

### 🚀 Deploy

#### **Vercel (Recomendado)**
1. Conecte seu repositório ao Vercel
2. Configure as variáveis de ambiente
3. Deploy automático

#### **Variáveis de Produção**
```env
NEXT_PUBLIC_SUPABASE_URL=sua_url_producao
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_producao
SUPABASE_SERVICE_ROLE_KEY=sua_service_role_producao
OPENAI_API_KEY=sua_openai_producao
```

### 🧪 Testes

#### **Exemplos de Teste**
```
"Ligar para cliente João sobre projeto até sexta-feira"
"Criar apresentação para reunião de amanhã às 14h"
"Revisar código do projeto React até quinta-feira"
```

#### **Funcionalidades para Testar**
1. **Chat IA**: Envie mensagens naturais
2. **Criação de Tarefas**: Verifique se são criadas corretamente
3. **Dashboard**: Teste navegação e visualização
4. **Autenticação**: Teste login/logout
5. **Áudio**: Teste transcrição de áudio

### 📝 Checklist de Implementação

#### **✅ Banco de Dados**
- [ ] Aplicar migração no Supabase
- [ ] Verificar tabelas criadas
- [ ] Testar RLS
- [ ] Verificar triggers

#### **✅ Configuração**
- [ ] Configurar .env.local
- [ ] Testar conexão Supabase
- [ ] Testar OpenAI API
- [ ] Gerar tipos TypeScript

#### **✅ Funcionalidades**
- [ ] Testar chat com IA
- [ ] Testar criação de tarefas
- [ ] Testar dashboard
- [ ] Verificar autenticação

#### **✅ Deploy**
- [ ] Configurar Vercel
- [ ] Configurar variáveis de produção
- [ ] Deploy automático
- [ ] Testar em produção

### 📚 Documentação

- `DOCUMENTACAO_COMPLETA_TASKFLOW_AI.md` - Documentação técnica completa
- `README.md` - Este guia de configuração

### 🆘 Suporte

#### **Problemas Comuns**
1. **Erro de conexão Supabase**: Verifique as chaves no .env.local
2. **Erro OpenAI**: Verifique a chave da API
3. **Erro de migração**: Execute manualmente no SQL Editor
4. **Erro de build**: Verifique dependências com `npm install`

#### **Logs Úteis**
- Supabase Dashboard > Logs
- Vercel Dashboard > Functions
- Console do navegador

### 🎉 Próximos Passos

1. **Configure as chaves** no .env.local
2. **Aplique a migração** no Supabase
3. **Teste o chat** com mensagens naturais
4. **Personalize** a interface conforme necessário
5. **Deploy** em produção

O projeto está **100% implementado** e pronto para uso! 🚀

---

**Desenvolvido com ❤️ usando Next.js, Supabase, OpenAI e TypeScript**
