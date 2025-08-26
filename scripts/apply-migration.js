#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Função para ler o arquivo de migração
function readMigrationFile() {
  const migrationPath = path.join(__dirname, '../src/lib/supabase/migrations/001_initial_schema.sql');
  
  try {
    return fs.readFileSync(migrationPath, 'utf8');
  } catch (error) {
    console.error('Erro ao ler arquivo de migração:', error);
    process.exit(1);
  }
}

// Função para aplicar migração via Supabase CLI
async function applyMigration() {
  const migration = readMigrationFile();
  
  console.log('🚀 Aplicando migração do TaskFlow AI...');
  console.log('📋 Arquivo: 001_initial_schema.sql');
  console.log('📊 Tabelas a serem criadas:');
  console.log('   - users');
  console.log('   - workspaces');
  console.log('   - projects');
  console.log('   - tasks');
  console.log('   - subtasks');
  console.log('   - entities');
  console.log('   - chat_messages');
  console.log('   - task_entities');
  console.log('   - ai_agent_logs');
  console.log('   - user_context');
  console.log('');
  
  // Verificar se o Supabase CLI está instalado
  const { execSync } = require('child_process');
  
  try {
    // Verificar se estamos logados no Supabase
    execSync('supabase status', { stdio: 'pipe' });
  } catch (error) {
    console.error('❌ Erro: Supabase CLI não está configurado');
    console.log('');
    console.log('📝 Para configurar o Supabase CLI:');
    console.log('   1. Instale: npm install -g supabase');
    console.log('   2. Login: supabase login');
    console.log('   3. Link: supabase link --project-ref YOUR_PROJECT_REF');
    console.log('');
    process.exit(1);
  }
  
  try {
    // Aplicar migração
    console.log('🔄 Aplicando migração...');
    execSync('supabase db push', { stdio: 'inherit' });
    
    console.log('');
    console.log('✅ Migração aplicada com sucesso!');
    console.log('');
    console.log('🎉 Próximos passos:');
    console.log('   1. Configure as variáveis de ambiente no .env.local');
    console.log('   2. Teste a conexão com o banco');
    console.log('   3. Execute o projeto: npm run dev');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao aplicar migração:', error.message);
    console.log('');
    console.log('🔧 Soluções possíveis:');
    console.log('   1. Verifique se o projeto está linkado: supabase status');
    console.log('   2. Re-link o projeto: supabase link --project-ref YOUR_PROJECT_REF');
    console.log('   3. Verifique as permissões do projeto');
    console.log('');
    process.exit(1);
  }
}

// Função para mostrar instruções manuais
function showManualInstructions() {
  console.log('📋 Instruções Manuais para Aplicar Migração');
  console.log('');
  console.log('1. Acesse o Supabase Dashboard: https://supabase.com/dashboard');
  console.log('2. Selecione seu projeto');
  console.log('3. Vá para SQL Editor');
  console.log('4. Cole o conteúdo do arquivo: src/lib/supabase/migrations/001_initial_schema.sql');
  console.log('5. Execute a query');
  console.log('');
  console.log('📁 Arquivo de migração: src/lib/supabase/migrations/001_initial_schema.sql');
  console.log('');
}

// Função principal
function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    console.log('🛠️  Script de Migração - TaskFlow AI');
    console.log('');
    console.log('Uso: node scripts/apply-migration.js [opções]');
    console.log('');
    console.log('Opções:');
    console.log('  --manual     Mostrar instruções manuais');
    console.log('  --help, -h   Mostrar esta ajuda');
    console.log('');
    return;
  }
  
  if (args.includes('--manual')) {
    showManualInstructions();
    return;
  }
  
  // Tentar aplicar migração automaticamente
  applyMigration();
}

// Executar script
if (require.main === module) {
  main();
}

module.exports = {
  applyMigration,
  showManualInstructions,
  readMigrationFile
};
