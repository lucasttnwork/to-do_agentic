# 🚀 Guia de Deploy - To-Do List Conversacional com IA

## 📋 Pré-requisitos

- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Conta na [OpenAI](https://openai.com)
- Repositório Git (GitHub, GitLab, etc.)

## 🔧 Configuração do Supabase

### 1. Criar Projeto
1. Acesse [supabase.com](https://supabase.com)
2. Clique em "New Project"
3. Escolha sua organização
4. Digite um nome para o projeto
5. Defina uma senha para o banco
6. Escolha uma região próxima
7. Clique em "Create new project"

### 2. Configurar Banco de Dados
1. No dashboard do Supabase, vá para "SQL Editor"
2. Execute o seguinte SQL:

```sql
-- Usuários
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  preferences JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Workspaces (Pessoal/Clientes)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('personal', 'client')),
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW()
);

-- Projetos
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  client_sla_hours INTEGER DEFAULT 24,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Tarefas principais
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  project_id UUID REFERENCES projects(id),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'done', 'archived')),
  priority INTEGER DEFAULT 2 CHECK (priority IN (1, 2, 3)),
  effort_minutes INTEGER,
  due_date TIMESTAMP,
  source_type TEXT,
  source_content TEXT,
  ai_confidence DECIMAL(3,2),
  embedding VECTOR(1536),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Subtarefas
CREATE TABLE subtasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'done')),
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Entidades extraídas
CREATE TABLE entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES workspaces(id),
  type TEXT NOT NULL,
  name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(workspace_id, type, name)
);

-- Relacionamento tarefas x entidades
CREATE TABLE task_entities (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  entity_id UUID REFERENCES entities(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, entity_id)
);

-- Log de atividades
CREATE TABLE activity_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID REFERENCES tasks(id),
  user_id UUID REFERENCES users(id),
  action TEXT NOT NULL,
  changes JSONB,
  ai_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_tasks_workspace ON tasks(workspace_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date);
```

### 3. Obter Credenciais
1. Vá para "Settings" > "API"
2. Copie:
   - Project URL
   - anon/public key
   - service_role key (mantenha secreto)

## 🔑 Configuração da OpenAI

### 1. Criar Conta
1. Acesse [platform.openai.com](https://platform.openai.com)
2. Crie uma conta ou faça login
3. Vá para "API Keys"
4. Clique em "Create new secret key"
5. Copie a chave (você só verá uma vez)

## 🚀 Deploy no Vercel

### 1. Conectar Repositório
1. Acesse [vercel.com](https://vercel.com)
2. Clique em "New Project"
3. Importe seu repositório Git
4. Selecione o framework: Next.js

### 2. Configurar Variáveis de Ambiente
No Vercel, vá para "Settings" > "Environment Variables" e adicione:

```
NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_do_supabase
OPENAI_API_KEY=sua_chave_da_openai
```

### 3. Deploy
1. Clique em "Deploy"
2. Aguarde o build completar
3. Acesse sua URL de produção

## 🔒 Configurações de Segurança

### 1. Supabase RLS (Row Level Security)
Execute no SQL Editor:

```sql
-- Habilitar RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

-- Políticas básicas (ajuste conforme necessário)
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can manage own workspaces" ON workspaces
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own projects" ON projects
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own tasks" ON tasks
  FOR ALL USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE user_id = auth.uid()
    )
  );
```

### 2. CORS (se necessário)
No Supabase, vá para "Settings" > "API" e adicione seu domínio Vercel em "Additional Allowed Origins".

## 📊 Monitoramento

### 1. Vercel Analytics
- Habilite Vercel Analytics no dashboard
- Monitore performance e erros

### 2. Supabase Monitoring
- Use o dashboard do Supabase para monitorar queries
- Configure alertas para uso de recursos

### 3. OpenAI Usage
- Monitore uso da API no dashboard da OpenAI
- Configure limites de gastos

## 🔧 Configurações Avançadas

### 1. Domínio Customizado
1. No Vercel, vá para "Settings" > "Domains"
2. Adicione seu domínio
3. Configure DNS conforme instruções

### 2. SSL/HTTPS
- Automático no Vercel
- Certificados Let's Encrypt incluídos

### 3. CDN
- Automático no Vercel
- Edge Network global

## 🚨 Troubleshooting

### Erro de Build
- Verifique se todas as variáveis de ambiente estão configuradas
- Confirme se as dependências estão no package.json
- Verifique logs no Vercel

### Erro de API
- Confirme credenciais do Supabase
- Verifique se o schema foi criado corretamente
- Teste endpoints localmente primeiro

### Erro de IA
- Confirme chave da OpenAI
- Verifique limites de uso da API
- Teste prompts localmente

## 📈 Escalabilidade

### 1. Supabase
- Upgrade para Pro plan para mais recursos
- Configure connection pooling
- Use read replicas se necessário

### 2. Vercel
- Upgrade para Pro plan para mais bandwidth
- Configure edge functions para APIs críticas
- Use serverless functions para processamento pesado

### 3. OpenAI
- Configure rate limiting
- Implemente caching para respostas
- Use streaming para respostas longas

## 🔄 CI/CD

### 1. GitHub Actions (opcional)
Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

## 📞 Suporte

- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Supabase**: [supabase.com/support](https://supabase.com/support)
- **OpenAI**: [help.openai.com](https://help.openai.com)

---

🎉 **Seu To-Do List Conversacional com IA está pronto para produção!**
