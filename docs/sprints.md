# Plano de Sprints - Task Manager

## Status Atual do Projeto

### ✅ Já Implementado (70% do Backend)
- Estrutura base do backend (Express + TypeScript + Prisma)
- Schema do banco de dados completo (User, Task, RefreshToken)
- Registro de usuários com bcrypt (12 rounds)
- Login com JWT (duas implementações: legacy + modular)
- CRUD de tarefas (GET, POST, PUT, DELETE)
- Middlewares (auth, error com Zod, notFound)
- Arquitetura modular avançada (Domain/Application/Infra/Presentation)
- Rate limiting no login
- Auditoria de login (IP, data)
- Isolamento de dados por usuário

### ❌ Gaps Críticos
- Logout não implementado
- Refresh token sem endpoint
- Validação Zod faltando em register e tasks
- Toggle de status de tarefa (PATCH)
- Validação de título obrigatório
- Frontend apenas estrutura inicial

**Decisão Arquitetural Necessária:** Projeto tem duas implementações de login (legacy + modular). Recomendo padronizar.

---

## Sprint 1: Autenticação Completa ✅ CONCLUÍDA
**Objetivo:** Implementar sistema de autenticação funcional

### Backend
- ✅ **Registro de usuários**
  - Validação de e-mail único (RN01)
  - Criptografia de senha com bcrypt 12 rounds (RNF02)
  - Validação com Zod
  - Tratamento de erros

- ✅ **Sistema de login**
  - Validação de credenciais
  - Geração de JWT (RNF03)
  - Access token (15min) + Refresh token (7 dias)
  - Auditoria de login (IP, data)
  - Rate limiting (10 tentativas/15min)

- ✅ **Logout**
  - Revogação de refresh tokens
  - Validação de token

- ✅ **Rotas de autenticação**
  - POST /api/auth/register
  - POST /api/auth/login
  - POST /api/auth/logout
  - POST /api/auth/refresh

### Frontend
- [ ] **Páginas de autenticação**
  - Página de login (/login)
  - Página de registro (/register)
  - Formulários com validação

- [ ] **Gerenciamento de estado**
  - Context para autenticação
  - Persistência de token
  - Redirecionamentos automáticos

### Testes
- [ ] **Testes de autenticação**
  - Registro com e-mail duplicado
  - Login com credenciais inválidas
  - Fluxo completo de autenticação

**Entregáveis:** RF01, RF02, RF03 + RNF02, RNF03 + RN01, RN04

---

## Sprint 2: CRUD de Tarefas - Backend ✅ CONCLUÍDA
**Objetivo:** API completa para gestão de tarefas

### Backend
- ✅ **Controllers de tarefas**
  - Validação de dados com Zod
  - Isolamento por usuário (RN02)
  - Tratamento de erros específicos

- ✅ **Validações**
  - Título obrigatório (RN03)
  - Verificação de propriedade da tarefa
  - Sanitização de inputs (trim)

- ✅ **Rotas completas**
  - GET /api/tasks (listar tarefas do usuário)
  - POST /api/tasks (criar tarefa)
  - PUT /api/tasks/:id (editar tarefa)
  - PATCH /api/tasks/:id/toggle (alternar status) ⭐ NOVO
  - DELETE /api/tasks/:id (excluir tarefa)

- ✅ **Arquitetura modular**
  - Domain/Application/Infra/Presentation
  - Services com responsabilidade única
  - Repository pattern

### Testes
- [ ] **Testes de CRUD**
  - Criar tarefa sem título (deve falhar)
  - Tentar acessar tarefa de outro usuário
  - Operações CRUD completas

**Entregáveis:** RF04, RF05, RF06, RF07, RF08 + RN02, RN03

---

## Sprint 3: Interface de Tarefas ✅ CONCLUÍDA
**Objetivo:** Frontend completo para gestão de tarefas

### Frontend
- ✅ **Dashboard principal**
  - Lista de tarefas do usuário
  - Contador de tarefas
  - Interface responsiva

- ✅ **Componentes de tarefa**
  - TaskCard (exibição individual com checkbox)
  - TaskForm (criação/edição)
  - TaskList (lista completa com empty state)

- ✅ **Funcionalidades interativas**
  - Criar nova tarefa
  - Editar tarefa existente
  - Marcar como concluída/pendente (toggle)
  - Excluir tarefa com confirmação

- ✅ **Estados da UI**
  - Loading (Spinner)
  - Error (ErrorMessage)
  - Empty state (sem tarefas)
  - Success (lista de tarefas)

### Autenticação
- ✅ **Páginas de autenticação**
  - Página de login (/login)
  - Página de registro (/register)
  - Formulários com validação

- ✅ **Gerenciamento de estado**
  - Context de autenticação
  - Persistência de tokens (localStorage)
  - Redirecionamentos automáticos
  - Header com logout

### Componentes UI Base
- ✅ Button (primary, secondary, danger)
- ✅ Input (com label e error)
- ✅ Spinner (loading state)
- ✅ ErrorMessage (error state)
- ✅ Header (navegação e logout)

### Design
- ✅ **Interface responsiva**
  - Layout mobile-first
  - Componentes adaptativos
  - Tailwind com tokens customizados
  - Zero valores hardcoded

**Entregáveis:** Interface completa para RF04-RF08 + RNF04 ✅

---

## Sprint 4: Testes e Polimento (1 semana) ⏳ PRÓXIMA
**Objetivo:** Finalizar, testar e documentar

### Qualidade
- [ ] **Testes automatizados**
  - Suite completa de testes Python (RNF05)
  - Testes de integração
  - Testes de regressão

- [ ] **Validações finais**
  - Verificar todos os requisitos
  - Testes de segurança
  - Performance básica

### Documentação
- [ ] **README atualizado**
  - Instruções de instalação
  - Como executar o projeto
  - Estrutura do código

- [ ] **API Documentation**
  - Endpoints disponíveis
  - Exemplos de uso
  - Códigos de erro

### Deploy
- [ ] **Preparação para produção**
  - Variáveis de ambiente
  - Build otimizado
  - Configurações de segurança

**Entregáveis:** RNF05, RNF06 + Projeto completo e documentado

---

## Critérios de Aceite por Sprint

### Sprint 1 ✅
- Usuário consegue se registrar com e-mail único
- Usuário consegue fazer login e receber token
- Usuário consegue fazer logout
- Senhas são criptografadas no banco

### Sprint 2 ✅
- API retorna apenas tarefas do usuário logado
- Não é possível criar tarefa sem título
- Todas as operações CRUD funcionam corretamente
- Usuário não consegue acessar tarefas de outros

### Sprint 3 ✅
- Interface funciona em mobile e desktop
- Todos os estados da UI estão cobertos
- Usuário consegue gerenciar tarefas completamente
- Feedback visual para todas as ações

### Sprint 4 ✅
- Todos os testes passam
- Documentação está completa
- Projeto roda sem erros
- Requisitos estão 100% atendidos

---

## Observações Técnicas

- **Cada sprint deve ser independente** e entregar valor
- **Testes devem ser escritos junto** com a implementação
- **Code review obrigatório** antes de merge
- **Deploy contínuo** a cada sprint finalizada
- **Retrospectiva** ao final de cada sprint para ajustes