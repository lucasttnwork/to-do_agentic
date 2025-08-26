#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

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

// Função para aplicar migração via cliente Supabase
async function applyMigrationDirect() {
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
  
  // Verificar variáveis de ambiente
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('❌ Erro: Variáveis de ambiente não configuradas');
    console.log('');
    console.log('📝 Configure as seguintes variáveis no .env.local:');
    console.log('   NEXT_PUBLIC_SUPABASE_URL=sua_url_do_supabase');
    console.log('   SUPABASE_SERVICE_ROLE_KEY=sua_chave_service_role');
    console.log('');
    process.exit(1);
  }
  
  try {
    // Importar cliente Supabase
    const { createClient } = require('@supabase/supabase-js');
    const supabase = createClient(supabaseUrl, serviceRoleKey);
    
    console.log('🔗 Conectando ao Supabase...');
    
    // Dividir a migração em partes menores para evitar timeouts
    const statements = migration
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));
    
    console.log(`📝 Executando ${statements.length} statements...`);
    
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.trim()) {
        try {
          console.log(`🔄 Executando statement ${i + 1}/${statements.length}...`);
          const { error } = await supabase.rpc('exec_sql', { sql: statement });
          
          if (error) {
            // Se exec_sql não existir, tentar executar diretamente
            console.log('⚠️  Tentando execução direta...');
            const { error: directError } = await supabase.from('_dummy').select('*').limit(0);
            if (directError && directError.message.includes('relation "_dummy" does not exist')) {
              console.log('✅ Conexão estabelecida, mas exec_sql não disponível');
              console.log('');
              console.log('📋 Para aplicar a migração manualmente:');
              console.log('1. Acesse: https://supabase.com/dashboard');
              console.log('2. Selecione seu projeto');
              console.log('3. Vá para SQL Editor');
              console.log('4. Cole o conteúdo do arquivo de migração');
              console.log('5. Execute');
              console.log('');
              console.log('📁 Arquivo: src/lib/supabase/migrations/001_initial_schema.sql');
              break;
            }
          }
        } catch (stmtError) {
          console.log(`⚠️  Statement ${i + 1} falhou (pode ser normal): ${stmtError.message}`);
        }
      }
    }
    
    console.log('');
    console.log('✅ Processo concluído!');
    console.log('');
    console.log('🎉 Próximos passos:');
    console.log('   1. Aplique a migração manualmente no Supabase Dashboard');
    console.log('   2. Configure as chaves no .env.local');
    console.log('   3. Teste a conexão');
    console.log('   4. Execute: npm run dev');
    console.log('');
    
  } catch (error) {
    console.error('❌ Erro ao conectar ao Supabase:', error.message);
    console.log('');
    console.log('🔧 Soluções possíveis:');
    console.log('   1. Verifique as variáveis de ambiente');
    console.log('   2. Verifique se o projeto existe');
    console.log('   3. Verifique se a service role key está correta');
    console.log('');
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
    console.log('🛠️  Script de Migração Direta - TaskFlow AI');
    console.log('');
    console.log('Uso: node scripts/apply-migration-direct.js [opções]');
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
  
  // Tentar aplicar migração
  applyMigrationDirect();
}

// Executar script
if (require.main === module) {
  main();
}

module.exports = {
  applyMigrationDirect,
  showManualInstructions,
  readMigrationFile
};
