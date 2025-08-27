# 🤖 PROMPT PARA IMPLEMENTAÇÃO - TASKFLOW AI

## 📋 **CONTEXTO DO PROJETO**

Você está trabalhando no **TaskFlow AI**, um sistema inteligente de gerenciamento de tarefas que utiliza múltiplos agentes de IA para automatizar a criação, organização e priorização de tarefas. O sistema é construído com Next.js 15, Supabase, OpenAI e LangGraph.

### **🎯 OBJETIVO ATUAL**
Implementar o sistema completo seguindo as diretrizes estabelecidas, começando pela fundação (banco de dados e autenticação) e progredindo até um sistema funcional de chat com IA.

### **✅ ESTADO ATUAL**
- **Sistema de autenticação**: ✅ IMPLEMENTADO e otimizado (sem recarregamentos desnecessários)
- **Estrutura do projeto**: ✅ COMPLETA com componentes, hooks e configurações
- **Otimizações de performance**: ✅ IMPLEMENTADAS (hidratação, throttling, persistência)
- **Interface de usuário**: ✅ ESTRUTURADA com componentes modernos e responsivos
- **Sistema de IA**: ⚠️ ESTRUTURADO mas não testado/ativo
- **Banco de dados**: ❌ NÃO CONFIGURADO
- **APIs**: ❌ NÃO IMPLEMENTADAS
- **Integração front-back**: ❌ NÃO CONECTADA

---

## 📚 **ARQUIVOS DE REFERÊNCIA ESSENCIAIS**

### **🚀 DIRETRIZES PRINCIPAIS**
- `DIRETRIZES_IMPLEMENTACAO.md` - **ROTEIRO COMPLETO** com 9 passos detalhados e ordem de execução

### **📖 DOCUMENTAÇÃO COMPLETA**
- `DOCUMENTACAO_COMPLETA_TASKFLOW_AI.md` - Visão geral completa do sistema, estrutura de diretórios e funcionalidades
- `README.md` - Informações básicas e setup do projeto
- `PLANO_IMPLEMENTACAO.md` - Plano detalhado de implementação com dependências e arquivos necessários
 - `LOG_DESENVOLVIMENTO.md` - Registro cronológico de mudanças e decisões (use como contexto em novos chats)

### **🔐 AUTENTICAÇÃO E PERFORMANCE**
- `OTIMIZACOES_AUTENTICACAO.md` - **CRÍTICO**: Todas as otimizações já implementadas no sistema de auth (useAuth hook, AuthProvider, middleware, etc.)
- `SOLUCAO_ERRO_LOGIN.md` - Soluções para problemas específicos de login

### **🗂️ ESTRUTURA E CONFIGURAÇÃO**
- `package.json` - Dependências completas (Next.js 15, Supabase, OpenAI, LangGraph, Zustand, etc.)
- `next.config.js` - Configurações otimizadas do Next.js
- `tailwind.config.ts` - Configurações do Tailwind CSS
- `tsconfig.json` - Configurações do TypeScript

---

## 🎯 **PRÓXIMO PASSO IMEDIATO**

### **PASSO 1: CONFIGURAR SUPABASE DATABASE**
Este é o **primeiro passo crítico** que deve ser executado antes de qualquer outro.

**O que fazer:**
1. Verificar se o banco Supabase está conectado
2. Aplicar a migração `001_initial_schema.sql` 
3. Confirmar extensões instaladas (vector, uuid-ossp, pgcrypto)
4. Testar criação de tabelas

**Arquivos relevantes:**
- `src/lib/supabase/migrations/001_initial_schema.sql` - Schema do banco
- `src/lib/supabase/client.ts` - Cliente Supabase configurado
- `.env.local` - Variáveis de ambiente do Supabase

---

## 🔧 **ESTRUTURA DO PROJETO ATUAL**

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes (estrutura criada, APIs não implementadas)
│   ├── dashboard/         # Dashboard principal (componentes estruturados)
│   ├── login/            # Página de login (implementada)
│   ├── register/         # Página de registro (implementada)
│   └── layout.tsx        # Layout raiz com AuthProvider
├── components/            # Componentes React (estrutura completa)
│   ├── auth/             # Sistema de autenticação (IMPLEMENTADO)
│   ├── dashboard/        # Componentes do dashboard (estruturados)
│   ├── chat/             # Interface de chat (estruturada)
│   ├── tasks/            # Componentes de tarefas (estruturados)
│   └── shared/           # Componentes compartilhados
├── hooks/                 # Hooks customizados (useAuth IMPLEMENTADO)
├── lib/                   # Lógica de negócio
│   ├── supabase/         # Configuração Supabase (cliente configurado)
│   ├── ai/               # Sistema de agentes IA (estruturado)
│   └── services/         # Serviços de dados (estruturados)
└── middleware.ts          # Middleware de autenticação (IMPLEMENTADO)
```

---

## 🚨 **PONTOS CRÍTICOS A CONSIDERAR**

### **✅ JÁ FUNCIONANDO:**
- Sistema de autenticação completo e otimizado
- Middleware de proteção de rotas
- Estrutura de componentes e páginas
- Hooks de autenticação otimizados
- Configurações de performance

### **❌ NECESSITA IMPLEMENTAÇÃO:**
- Banco de dados Supabase configurado
- APIs para CRUD de entidades
- Integração entre front-end e back-end
- Sistema de IA ativo e funcional
- Chat conectado com IA

### **⚠️ ATENÇÃO ESPECIAL:**
- **NÃO altere** o sistema de autenticação já implementado
- **NÃO modifique** as otimizações de performance existentes
- **SEMPRE teste** cada funcionalidade antes de prosseguir
- **Siga a ordem exata** dos passos das diretrizes

---

## 🚀 **INSTRUÇÕES PARA O CHAT**

### **1. LEIA PRIMEIRO:**
- `DIRETRIZES_IMPLEMENTACAO.md` (roteiro completo)
- `OTIMIZACOES_AUTENTICACAO.md` (sistema de auth já implementado)
- `DOCUMENTACAO_COMPLETA_TASKFLOW_AI.md` (visão geral do sistema)

### **2. ENTENDA O CONTEXTO:**
- Sistema de autenticação já está funcionando perfeitamente
- Estrutura do projeto está completa e organizada
- Foco deve ser em conectar as peças existentes

### **3. SIGA A ORDEM:**
- **PASSO 1**: Configurar Supabase Database
- **PASSO 2**: Testar Sistema de Autenticação (já funciona)
- **PASSO 3**: Implementar APIs Básicas
- E assim por diante...

### **4. IMPLEMENTE INCREMENTALMENTE:**
- Pequenas mudanças de cada vez
- Teste imediatamente após cada mudança
- Corrija problemas antes de continuar

### **5. MANTENHA O LOG ATUALIZADO:**
- Registre cada ação relevante no `LOG_DESENVOLVIMENTO.md` (data, objetivo, mudanças, arquivos, próximos passos)
- Use o template do log para manter entradas curtas e objetivas
- Em novos chats, referencie as entradas mais recentes para recuperar o contexto rapidamente

---

## 📝 **EXEMPLO DE INÍCIO DO CHAT**

```
Olá! Estou trabalhando no TaskFlow AI e preciso implementar o sistema seguindo as diretrizes estabelecidas.

CONTEXTO:
- Sistema de autenticação já implementado e otimizado
- Estrutura do projeto completa
- Próximo passo: Configurar Supabase Database

ARQUIVOS DE REFERÊNCIA:
- DIRETRIZES_IMPLEMENTACAO.md (roteiro completo)
- OTIMIZACOES_AUTENTICACAO.md (auth já implementado)
- DOCUMENTACAO_COMPLETA_TASKFLOW_AI.md (visão geral)

PRÓXIMO PASSO:
Preciso configurar o banco de dados Supabase aplicando a migração 001_initial_schema.sql e verificando as extensões necessárias.

Pode me ajudar a começar com este primeiro passo?
```

---

## 🎯 **RESULTADO ESPERADO**

Ao final da implementação, você terá:
- ✅ Sistema de autenticação funcionando (já implementado)
- ✅ Banco de dados configurado e funcionando
- ✅ APIs respondendo com dados reais
- ✅ Dashboard conectado com back-end
- ✅ CRUD de tarefas funcionando
- ✅ Sistema de IA ativo e criando tarefas
- ✅ Chat conversacional funcional
- ✅ Sistema completo e estável

---

## 📋 **CHECKLIST DE PREPARAÇÃO**

Antes de iniciar o chat, certifique-se de:
- [ ] Ler `DIRETRIZES_IMPLEMENTACAO.md` completamente
- [ ] Entender que o sistema de auth já está funcionando
- [ ] Ter acesso ao projeto e arquivos
- [ ] Ter as credenciais do Supabase (se necessário)
- [ ] Estar preparado para implementar incrementalmente

---

*Use este prompt como base para iniciar o chat de implementação*
*Mantenha o foco no próximo passo específico*
*Não altere o que já está funcionando*
