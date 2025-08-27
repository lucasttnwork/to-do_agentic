# 🚀 TaskFlow AI - Sistema de Gerenciamento de Tarefas com IA

Sistema inteligente de gerenciamento de tarefas que permite criação automática através de chat conversacional, com integração em tempo real entre front-end e back-end.

## ✨ **Funcionalidades Principais**

- 🤖 **IA Conversacional**: Crie tarefas conversando naturalmente
- ⚡ **Tempo Real**: Sincronização automática entre dispositivos
- 🎯 **Organização Inteligente**: Priorização automática e organização por contexto
- 🔐 **Autenticação Segura**: Sistema completo de login/registro com Supabase
- 📱 **Interface Responsiva**: Design moderno com glassmorphism
- 🚀 **Performance Otimizada**: Next.js 14 com App Router

## 🛠️ **Tecnologias Utilizadas**

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **IA**: OpenAI GPT-4, Embeddings para busca semântica
- **Estilização**: Framer Motion, Glassmorphism, Gradientes
- **Estado**: Zustand, React Hooks

## 🚀 **Instalação e Configuração**

### **1. Pré-requisitos**
- Node.js 18+ 
- npm ou yarn
- Conta no Supabase
- Chave da API OpenAI

### **2. Clone o repositório**
```bash
git clone <url-do-repositorio>
cd to-do_agentic
```

### **3. Instale as dependências**
```bash
npm install
# ou
yarn install
```

### **4. Configure as variáveis de ambiente**
Crie um arquivo `.env.local` na raiz do projeto:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase

# OpenAI Configuration
OPENAI_API_KEY=sua_chave_da_api_openai

# Anthropic Configuration (opcional)
ANTHROPIC_API_KEY=sua_chave_da_api_anthropic
```

### **5. Configure o Supabase**

#### **5.1 Crie um projeto no Supabase**
1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Crie um novo projeto
4. Anote a URL e as chaves de API

#### **5.2 Aplique o schema do banco de dados**
1. No painel do Supabase, vá para **SQL Editor**
2. Execute o conteúdo do arquivo `src/lib/supabase/migrations/001_initial_schema.sql`
3. Isso criará todas as tabelas, políticas RLS e funções necessárias

#### **5.3 Configure autenticação**
1. No painel do Supabase, vá para **Authentication > Settings**
2. Configure as URLs permitidas:
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/login`, `http://localhost:3000/register`

### **6. Execute o projeto**
```bash
npm run dev
# ou
yarn dev
```

Acesse [http://localhost:3000](http://localhost:3000)

## 🔐 **Sistema de Autenticação**

### **Funcionalidades Implementadas**
- ✅ Login com email/senha
- ✅ Registro de novos usuários
- ✅ Middleware de proteção de rotas
- ✅ Context de autenticação global
- ✅ Verificação automática de sessão
- ✅ Logout seguro

### **Rotas Protegidas**
- `/dashboard/*` - Requer autenticação
- `/api/*` - Requer token válido (exceto `/api/auth/*`)

### **Rotas Públicas**
- `/` - Página inicial
- `/login` - Formulário de login
- `/register` - Formulário de registro

## 📁 **Estrutura do Projeto**

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # APIs do backend
│   │   ├── auth/          # Autenticação
│   │   ├── workspaces/    # Gerenciamento de workspaces
│   │   ├── projects/      # Gerenciamento de projetos
│   │   └── tasks/         # Gerenciamento de tarefas
│   ├── dashboard/         # Dashboard principal
│   ├── login/             # Página de login
│   └── register/          # Página de registro
├── components/             # Componentes React
│   ├── auth/              # Componentes de autenticação
│   ├── dashboard/         # Componentes do dashboard
│   └── shared/            # Componentes compartilhados
├── hooks/                  # Custom hooks
│   ├── useAuth.ts         # Hook de autenticação
│   └── useSupabase.ts     # Hook para Supabase
├── lib/                    # Utilitários e configurações
│   ├── auth.ts            # Funções de autenticação
│   └── supabase/          # Configuração do Supabase
└── types/                  # Definições de tipos TypeScript
```

## 🎯 **Como Usar**

### **1. Primeiro Acesso**
1. Acesse a página inicial
2. Clique em "Criar Conta"
3. Preencha seus dados e crie uma conta
4. Faça login com suas credenciais

### **2. Criando Tarefas**
1. No dashboard, use o chat conversacional
2. Digite ou grave mensagens como:
   - "Cliente precisa de orçamento até sexta"
   - "Reunião com equipe amanhã às 10h"
   - "Finalizar relatório do projeto X"
3. A IA analisará e criará tarefas automaticamente

### **3. Gerenciando Workspaces e Projetos**
1. Use o sidebar para navegar entre workspaces
2. Crie novos projetos dentro dos workspaces
3. Organize tarefas por projeto e prioridade

## 🔧 **APIs Disponíveis**

### **Workspaces**
- `GET /api/workspaces` - Listar workspaces do usuário
- `POST /api/workspaces` - Criar novo workspace
- `PUT /api/workspaces` - Atualizar workspace
- `DELETE /api/workspaces` - Deletar workspace

### **Projetos**
- `GET /api/projects` - Listar projetos do usuário
- `POST /api/projects` - Criar novo projeto
- `PUT /api/projects` - Atualizar projeto
- `DELETE /api/projects` - Deletar projeto

### **Tarefas**
- `GET /api/tasks` - Listar tarefas do workspace
- `POST /api/tasks` - Criar nova tarefa
- `PUT /api/tasks` - Atualizar tarefa
- `DELETE /api/tasks` - Deletar tarefa

## 🚨 **Troubleshooting**

### **Problemas Comuns**

#### **1. Erro de autenticação**
- Verifique se as variáveis do Supabase estão corretas
- Confirme se o schema foi aplicado no banco
- Verifique se as políticas RLS estão ativas

#### **2. Erro de conexão com Supabase**
- Verifique a URL e chaves no `.env.local`
- Confirme se o projeto está ativo no Supabase
- Verifique se não há bloqueios de firewall

#### **3. Erro de OpenAI**
- Verifique se a chave da API está correta
- Confirme se tem créditos disponíveis na conta
- Verifique se a API está funcionando

### **Logs e Debug**
- Use o console do navegador para logs do frontend
- Verifique os logs do Supabase no painel
- Use o middleware para debug de autenticação

## 📈 **Próximos Passos**

### **Fase 2: Integração (Semana 3-4)**
- [ ] Sistema de eventos real-time
- [ ] Pipeline de agentes de IA
- [ ] Sincronização de estado

### **Fase 3: Funcionalidades (Semana 5-6)**
- [ ] Componentes de visualização de tarefas
- [ ] Funcionalidades de criação/edição
- [ ] Busca e filtros avançados

### **Fase 4: Polimento (Semana 7-8)**
- [ ] Testes e correção de bugs
- [ ] Melhorias de UX/UI
- [ ] Otimizações de performance

## 🤝 **Contribuição**

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 **Licença**

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 **Suporte**

- **Issues**: Use o GitHub Issues para reportar bugs
- **Documentação**: Consulte a documentação do Supabase e Next.js
- **Comunidade**: Participe da comunidade do Supabase

---

**Desenvolvido com ❤️ usando Next.js, Supabase e OpenAI**
