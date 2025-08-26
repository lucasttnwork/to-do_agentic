#!/usr/bin/env node

const http = require('http');

console.log('🧪 Testando Interface da To-Do List Conversacional com IA');
console.log('========================================================');

// Teste 1: Página principal
console.log('\n1️⃣ Testando página principal...');
const testMainPage = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const hasTitle = data.includes('To-Do List Conversacional com IA');
        const hasReact = data.includes('__next_f');
        resolve({
          status: res.statusCode,
          hasTitle,
          hasReact,
          success: res.statusCode === 200 && hasTitle && hasReact
        });
      });
    });
    
    req.on('error', () => {
      resolve({ status: 0, success: false, error: 'Connection failed' });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, success: false, error: 'Timeout' });
    });
  });
};

// Teste 2: API de tarefas (sem parâmetros - deve retornar 404)
console.log('2️⃣ Testando API de tarefas...');
const testTasksAPI = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/tasks', (res) => {
      resolve({
        status: res.statusCode,
        success: res.statusCode === 404 // Esperado sem workspace_id
      });
    });
    
    req.on('error', () => {
      resolve({ status: 0, success: false, error: 'Connection failed' });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, success: false, error: 'Timeout' });
    });
  });
};

// Teste 3: API de tarefas com workspace_id
console.log('3️⃣ Testando API de tarefas com workspace_id...');
const testTasksAPIWithWorkspace = () => {
  return new Promise((resolve) => {
    const req = http.get('http://localhost:3000/api/tasks?workspace_id=2', (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({
            status: res.statusCode,
            success: res.statusCode === 200 && json.success,
            hasTasks: json.tasks && Array.isArray(json.tasks)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            success: false,
            error: 'Invalid JSON response'
          });
        }
      });
    });
    
    req.on('error', () => {
      resolve({ status: 0, success: false, error: 'Connection failed' });
    });
    
    req.setTimeout(5000, () => {
      req.destroy();
      resolve({ status: 0, success: false, error: 'Timeout' });
    });
  });
};

// Executar testes
async function runTests() {
  const results = [];
  
  // Teste 1
  const mainPageResult = await testMainPage();
  results.push({ name: 'Página Principal', ...mainPageResult });
  
  // Teste 2
  const tasksAPIResult = await testTasksAPI();
  results.push({ name: 'API Tarefas (sem parâmetros)', ...tasksAPIResult });
  
  // Teste 3
  const tasksAPIWithWorkspaceResult = await testTasksAPIWithWorkspace();
  results.push({ name: 'API Tarefas (com workspace_id)', ...tasksAPIWithWorkspaceResult });
  
  // Exibir resultados
  console.log('\n📊 Resultados dos Testes:');
  console.log('==========================');
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    const details = result.error ? ` (${result.error})` : ` (Status: ${result.status})`;
    console.log(`${index + 1}. ${status} ${result.name}${details}`);
  });
  
  const allPassed = results.every(r => r.success);
  console.log(`\n${allPassed ? '🎉 Todos os testes passaram!' : '⚠️ Alguns testes falharam.'}`);
  
  if (allPassed) {
    console.log('\n🚀 Interface está funcionando perfeitamente!');
    console.log('📍 Acesse: http://localhost:3000');
    console.log('\n📋 Funcionalidades disponíveis:');
    console.log('   • Seletor de workspaces (Pessoal/NTEX)');
    console.log('   • Lista de projetos (Kabbatec, Cartório, Academia SP)');
    console.log('   • Visualizações: Lista, Kanban, Timeline');
    console.log('   • Cards de tarefas com prioridades e prazos');
    console.log('   • Interface de chat (pronta para IA)');
    console.log('   • Dados mockados para demonstração');
  }
}

runTests().catch(console.error);
