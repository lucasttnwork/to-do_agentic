# 🧭 LOG DE DESENVOLVIMENTO — TaskFlow AI

Este documento registra, de forma cronológica, as ações de desenvolvimento, decisões técnicas e alterações de código.

Objetivos:
- Contexto rápido em novos chats/sessões
- Rastreabilidade de mudanças e motivos
- Organização do progresso entre sprints e branches

## Como usar
- Adicione nova entrada no topo com data e título curto
- Resuma objetivo, mudanças, arquivos impactados e próximos passos
- Referencie PRs/commits/issues quando existirem
- Mantenha cada entrada curta (3–8 bullets)

Template sugerido:
```
## YYYY-MM-DD — [Breve título]
- Objetivo: ...
- Mudanças: ...
- Arquivos: `path/a`, `path/b`
- APIs/DB: ...
- Riscos/Pendências: ...
- Próximo passo: ...
```

---

## 2025-08-27 — Filtros de tarefas (status e prioridade) conectados
- Objetivo: Implementar filtros reais na lista de tarefas via selects.
- Mudanças:
  - Estado global `taskFilters` no Zustand (`status`, `priority`).
  - `TaskViewSwitcher` conectado a `taskFilters` e `setTaskFilters`.
  - `TaskList` passa filtros para `useTasks`, que consulta `/api/tasks` com `status`/`priority`.
  - Header do card de tarefas no dashboard usa `TaskViewSwitcher` reutilizável.
- Arquivos: `src/lib/store.ts`, `src/components/tasks/TaskViewSwitcher.tsx`, `src/components/tasks/TaskList.tsx`, `src/app/dashboard/page.tsx`.
- Riscos/Pendências: persistência dos filtros por usuário; reset ao trocar workspace; i18n dos labels.
- Próximo passo: CRUD (editar/status/priority/deletar) com revalidação e ações inline.

## 2025-08-27 — CRUD básico no cartão de tarefa (status, prioridade, deletar)
- Objetivo: Permitir atualização rápida de status/prioridade e exclusão inline.
- Mudanças:
  - `TaskCard` ganhou selects de status/priority e botão deletar; chamadas PUT/DELETE `/api/tasks` com Authorization.
  - Atualização otimista do Zustand (`updateTask`/`deleteTask`) com revalidação do SWR após cada ação.
  - `TaskList` passa `onUpdated/onDeleted` para forçar `refresh()` do hook.
- Arquivos: `src/components/tasks/TaskCard.tsx`, `src/components/tasks/TaskList.tsx`.
- Riscos/Pendências: rollback de erro (atual otimista simples), confirmação de delete, edição de título/descrição.
- Próximo passo: permitir edição de título/descrição via modal rápido e revalidar; iniciar Kanban.

## 2025-08-27 — Kanban funcional com drag-and-drop e Timeline aprimorada
- Objetivo: Implementar Kanban interativo e Timeline com agrupamento por datas relativas.
- Mudanças:
  - `TaskKanban` ganhou drag-and-drop HTML5 nativo; arraste tarefas entre colunas para alterar status automaticamente.
  - Atualização otimista + PUT `/api/tasks` com rollback simples (reload em caso de erro).
  - `TaskTimeline` com agrupamento inteligente: "Hoje", "Amanhã", "Em X dias", indicadores de atraso.
  - `CreateTaskModal` melhorado: validações, labels em português, estados de loading, feedback de erro.
- Arquivos: `src/components/tasks/TaskKanban.tsx`, `src/components/tasks/TaskTimeline.tsx`, `src/components/dashboard/CreateTaskModal.tsx`.
- Riscos/Pendências: performance em listas grandes; UX do drag (preview/ghost); persistência de filtros.
- Próximo passo: otimizações de performance, melhorias de UX e feedback visual.

## 2025-08-27 — UX do Dashboard, criação de tarefas e correções
- Objetivo: Tornar o dashboard dinâmico, compacto e responsivo; habilitar criação de tarefas.
- Mudanças:
  - Integração do botão “+ New Task” com `CreateTaskModal` e POST `/api/tasks` usando Authorization e IDs atuais; revalidação do `useTasks` após criar.
  - Correção de loop em `TaskList` (sincroniza store somente quando `swrTasks` realmente muda — comparação por tamanho/ids).
  - Layout: largura 100%, `min-h` no container com `overflow-auto` para telas mais baixas; paddings/gaps reduzidos no header, stats e conteúdo.
  - Cards de métricas reestruturados em layout horizontal e altura menor (`SimpleStatsCard`).
  - Cards da lista mais compactos (`TaskCard` tipografia/padding menores) e `TaskList` com `space-y` reduzido.
  - Sidebar com grandes volumes: `WorkspaceSelector` e `ProjectList` com `max-h` + `overflow-auto`.
- Arquivos: `src/app/dashboard/page.tsx`, `src/components/dashboard/CreateTaskModal.tsx`, `src/components/tasks/TaskList.tsx`, `src/components/tasks/TaskCard.tsx`, `src/components/dashboard/WorkspaceSelector.tsx`, `src/components/dashboard/ProjectList.tsx`, `src/components/premium/Glass/SimpleStatsCard.tsx`.
- Riscos/Pendências: validar UX em ultrawide/alturas muito baixas; conectar filtros (prioridade/status) e ações de edição/remoção; otimizar animações.
- Próximo passo: filtros funcionais, CRUD completo e criação via chat.

## 2025-08-27 — Integração do Dashboard com APIs (Workspaces/Projetos/Tarefas)
- Objetivo: Conectar UI do dashboard às rotas atuais e garantir interatividade básica
- Mudanças:
  - Criados hooks SWR: `useWorkspaces`, `useProjects`, `useTasks`
  - `WorkspaceSelector` agora consome `/api/workspaces`, seleciona o primeiro workspace automaticamente e reseta projeto ao trocar
  - `ProjectList` consome `/api/projects?workspace_id=...`
  - `TaskList` consome `/api/tasks?workspace_id=...&project_id=...` e sincroniza com `store`
  - API `GET /api/tasks` agora aceita `project_id` para filtrar
  - Fallback: criação automática de workspace `Personal` quando lista vier vazia
- Ajustes adicionais:
  - Hooks passaram a aguardar o token (`getAccessToken`) antes do fetch, evitando 401 e listas vazias na 1ª renderização
  - Middleware libera `/api/*` com `Authorization: Bearer` mesmo sem sessão por cookie (rotas já validam token e RLS)
  - `StatsCards` agora lê `tasks` do `store` e calcula métricas dinâmicas (Total/Completed/In Progress/High Priority)
  - Semeados dados de teste: workspace `Sandbox` com 5 projetos, cada um com 8 tarefas e 3 subtarefas
- Arquivos: `src/hooks/useWorkspaces.ts`, `src/hooks/useProjects.ts`, `src/hooks/useTasks.ts`, `src/components/dashboard/WorkspaceSelector.tsx`, `src/components/dashboard/ProjectList.tsx`, `src/components/tasks/TaskList.tsx`, `src/app/api/tasks/route.ts`, `src/app/dashboard/page.tsx`
- Riscos/Pendências: warnings de `console.*` e `no-unused-vars` ainda presentes; script `lint` falha por `--max-warnings 0`
- Próximo passo: reduzir warnings prioritários, integrar criação/edição (tarefas/subtarefas)

## 2025-08-27 — Fundação do banco e APIs básicas
- Objetivo: Validar Supabase, aplicar schema inicial e expor CRUDs essenciais
- Mudanças:
  - Validado `.env.local` e `src/lib/supabase/client.ts`
  - Confirmadas extensões `uuid-ossp`, `pgcrypto` e `vector`
  - Confirmada migração `001_initial_schema.sql` (tabelas, índices, função `search_tasks_semantic`)
  - Implementados endpoints CRUD: `src/app/api/entities/route.ts`, `src/app/api/subtasks/route.ts`
  - Ajustado `src/app/api/tasks/route.ts` para remover `client_id` inexistente de `projects`
  - Linter executado sem erros nos arquivos alterados
- Arquivos: `.env.local`, `src/lib/supabase/client.ts`, `src/app/api/**`
- APIs/DB: Índice `tasks_embedding_idx` e função `search_tasks_semantic` presentes
- Próximo passo: Testar endpoints via REST client e integrar frontend se necessário

## 2025-08-27 — Documentação do log
- Objetivo: Criar log de desenvolvimento e referenciá-lo no prompt
- Mudanças:
  - Criado `LOG_DESENVOLVIMENTO.md` (este arquivo)
  - Atualizado `PROMPT_IMPLEMENTACAO.md` para incluir referência e instruções de uso do log
- Próximo passo: Manter este log atualizado a cada mudança relevante

## 2025-08-27 — Validações de Lint/Build e ajustes de Login
- Objetivo: Garantir build estável e corrigir lint crítico
- Mudanças:
  - Corrigido `next-env.d.ts` substituindo triple-slash por import
  - Ajustado `src/app/login/page.tsx` para envolver `useSearchParams` em `<Suspense>`
  - Build Next executado com sucesso (avisos de console e unused permanecem, não bloqueiam)
  - Observação: `experimental.serverComponentsExternalPackages` agora é `serverExternalPackages` (planejar ajuste)
- Próximo passo: Avaliar atualização do `next.config.js` e reduzir warnings quando oportuno

## 2025-08-27 — Revisão técnica e pendências identificadas
- Observações:
  - RLS/Supabase: rotas validam token mas usam cliente global sem header Authorization; criar cliente por requisição com o token.
  - next-env.d.ts: regra do ESLint sobre triple-slash volta quando o arquivo é regenerado. Adicionar override específico para ignorar esse arquivo.
  - Busca semântica: `searchTasksSemantic()` retorna shape `{ id, title, description, similarity }`, não um `Task`. Criar tipo `SemanticTaskMatch`.
  - Warnings: excesso de `console.*` e imports não usados; não bloqueiam build mas poluem CI.
  - Segurança: garantir que `SUPABASE_SERVICE_ROLE_KEY` nunca vaze para o cliente (server-only).
- Ações planejadas:
  1) Implementar `getSupabaseForRequest(token)` e substituir uso do cliente global nas rotas API.
  2) Adicionar override no ESLint para `next-env.d.ts`.
  3) Criar tipo `SemanticTaskMatch` e ajustar `embedding-service`/chamadores.
  4) Limpeza incremental de warnings principais em componentes do dashboard.

## 2025-08-27 — Catálogo do estado atual (UI + APIs + DB)
- Banco de dados: migração `001_initial_schema.sql` confirmada; RLS ativo; índice `tasks_embedding_idx` e função `search_tasks_semantic` operacionais; extensões `uuid-ossp`, `pgcrypto`, `vector` ativas.
- Supabase/Autorização: criado `createRequestSupabaseClient(token)` em `src/lib/supabase/client.ts` e aplicado nas rotas `workspaces`, `projects`, `tasks`, `entities`, `subtasks` para garantir RLS por requisição.
- APIs: CRUDs implementados e corrigidos (`entities`, `subtasks`, ajustes em `tasks` e `projects`).
- UI/Build: correção de Suspense no `login`; fallback amigável no `dashboard` quando `!user` para evitar tela em branco; `next.config.js` migrado para `serverExternalPackages`; override ESLint para `next-env.d.ts`.
- Tipagem: adicionado `SemanticTaskMatch` e alinhado `searchTasksSemantic` ao retorno do RPC.
- Documentação: `LOG_DESENVOLVIMENTO.md` criado e referenciado em `PROMPT_IMPLEMENTACAO.md`.
- Status: build de produção sobe em `localhost:3000`; UI funcional (`/`, `/login`, `/dashboard`).
