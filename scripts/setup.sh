#!/bin/bash

echo "🚀 Configurando To-Do List Conversacional com IA"
echo "================================================"

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado. Instale o Node.js primeiro."
    exit 1
fi

# Verificar se npm está instalado
if ! command -v npm &> /dev/null; then
    echo "❌ npm não encontrado. Instale o npm primeiro."
    exit 1
fi

echo "✅ Node.js e npm encontrados"

# Instalar dependências
echo "📦 Instalando dependências..."
npm install

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo "📝 Criando arquivo .env.local..."
    cp .env.local.example .env.local
    echo "⚠️  IMPORTANTE: Configure suas variáveis de ambiente no arquivo .env.local"
    echo "   - NEXT_PUBLIC_SUPABASE_URL"
    echo "   - NEXT_PUBLIC_SUPABASE_ANON_KEY"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - OPENAI_API_KEY"
else
    echo "✅ Arquivo .env.local já existe"
fi

# Verificar se as variáveis estão configuradas
echo "🔍 Verificando configuração..."

if grep -q "your_supabase_url_here" .env.local; then
    echo "⚠️  Configure as variáveis do Supabase no .env.local"
fi

if grep -q "your_openai_api_key_here" .env.local; then
    echo "⚠️  Configure a chave da OpenAI no .env.local"
fi

echo ""
echo "🎉 Setup concluído!"
echo ""
echo "📋 Próximos passos:"
echo "1. Configure as variáveis de ambiente no .env.local"
echo "2. Crie um projeto no Supabase e execute o schema SQL"
echo "3. Execute 'npm run dev' para iniciar o servidor"
echo "4. Acesse http://localhost:3000"
echo ""
echo "📚 Consulte o README.md para mais informações"
