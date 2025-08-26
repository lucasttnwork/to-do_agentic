# 🚀 Implementação Rápida - TaskFlow AI

## ⚡ Passos Essenciais (5 minutos)

### 1. 🔑 Configurar Chaves (2 min)

**Acesse o Supabase Dashboard:**
- URL: https://supabase.com/dashboard
- Projeto: `kdlvebimzmwsyfcrevng`

**Obter chaves:**
1. Vá para **Settings > API**
2. Copie **Project URL** e **anon public key**
3. Para **service_role key**: **Settings > API > Project API keys**

**Editar `.env.local`:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://kdlvebimzmwsyfcrevng.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anonima_aqui
SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role_aqui
OPENAI_API_KEY=sua_chave_openai_aqui
```

### 2. 🗄️ Aplicar Migração (1 min)

**No Supabase Dashboard:**
1. Vá para **SQL Editor**
2. Cole o conteúdo do arquivo: `src/lib/supabase/migrations/001_initial_schema.sql`
3. Clique em **Run**

### 3. 🚀 Executar Projeto (1 min)

```bash
npm install
npm run dev
```

Acesse: http://localhost:3000

### 4. 🧪 Testar (1 min)

**Envie uma mensagem no chat:**
```
"Ligar para cliente João sobre projeto até sexta-feira"
```

## ✅ Checklist Rápido

- [ ] Chaves configuradas no `.env.local`
- [ ] Migração aplicada no Supabase
- [ ] Projeto executando (`npm run dev`)
- [ ] Chat funcionando
- [ ] Tarefa criada automaticamente

## 🆘 Problemas Comuns

### Erro de Conexão Supabase
```bash
# Verificar conexão
node scripts/apply-migration-direct.js
```

### Erro OpenAI
- Verifique se a chave está correta
- Teste no dashboard do OpenAI

### Erro de Build
```bash
npm install
npm run dev
```

## 📞 Suporte Rápido

- **Logs**: Supabase Dashboard > Logs
- **SQL**: Supabase Dashboard > SQL Editor
- **Config**: Verificar `.env.local`

---

**🎉 Pronto! Seu TaskFlow AI está funcionando!**
