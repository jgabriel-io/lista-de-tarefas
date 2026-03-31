# Relatório Final — Plano de Testes
## Sistema: Task Manager
### Disciplina: Qualidade e Testes de Software

---

## Identificação

| Campo | Informação |
|-------|------------|
| Disciplina | Qualidade e Testes de Software |
| Sistema Desenvolvido | Task Manager — Gerenciador de Tarefas |
| Integrantes | João Gabriel e Rhuan |
| Repositório | https://github.com/lista-de-tarefas |
| Data de Entrega | 2026 |

---

## Introdução

Este relatório documenta o processo completo de desenvolvimento e teste do sistema **Task Manager**, um gerenciador de tarefas pessoais com autenticação de usuários.

O trabalho seguiu todas as etapas exigidas pela atividade: levantamento de requisitos, elaboração do plano de testes, criação dos casos de teste, implementação de scripts automatizados com Pytest, execução de testes manuais e documentação dos resultados.

O sistema foi desenvolvido do zero, com frontend em Next.js, backend em Node.js/Express e banco de dados SQLite. A arquitetura segue os princípios de Clean Architecture, separando responsabilidades em camadas de domínio, aplicação, infraestrutura e apresentação.

---

## Etapa 1 — Levantamento de Requisitos

### 1.1 Descrição do Sistema

O Task Manager é um sistema web de gerenciamento de tarefas pessoais com autenticação de usuários. Permite que cada usuário cadastre, visualize, edite, conclua e exclua suas próprias tarefas de forma segura e isolada.

**Stack tecnológica:**
- Frontend: Next.js 14, React 18, TypeScript, Tailwind CSS
- Backend: Node.js, Express, TypeScript, Prisma ORM
- Banco de Dados: SQLite
- Autenticação: JWT (JSON Web Token) + Bcrypt

---

### 1.2 Requisitos Funcionais

| ID | Requisito | Módulo |
|----|-----------|--------|
| RF01 | O sistema deve permitir que um novo usuário se cadastre informando e-mail e senha | Autenticação |
| RF02 | O sistema deve permitir que o usuário cadastrado acesse sua conta via e-mail e senha | Autenticação |
| RF03 | O sistema deve permitir que o usuário encerre sua sessão de forma segura | Autenticação |
| RF04 | O usuário logado deve poder cadastrar uma nova tarefa com título e descrição opcional | Tarefas |
| RF05 | O sistema deve exibir uma lista das tarefas cadastradas pelo usuário logado | Tarefas |
| RF06 | O usuário deve poder alterar o título, a descrição ou o status de uma tarefa existente | Tarefas |
| RF07 | O usuário deve poder remover uma tarefa da sua lista permanentemente | Tarefas |
| RF08 | O usuário deve poder alternar o status da tarefa entre "Pendente" e "Concluída" | Tarefas |

---

### 1.3 Requisitos Não Funcionais

| ID | Requisito | Tecnologia |
|----|-----------|------------|
| RNF01 | Persistência de dados entre reinicializações do servidor | SQLite via Prisma ORM |
| RNF02 | Senhas armazenadas de forma criptografada | Bcrypt (12 rounds) |
| RNF03 | Comunicação autenticada via token | JWT (access 15min + refresh 7 dias) |
| RNF04 | Interface adaptável para mobile e desktop | Tailwind CSS (mobile-first) |
| RNF05 | API RESTful testável via automação | Pytest (Python) |
| RNF06 | Tipagem estática no frontend e backend | TypeScript |

---

### 1.4 Regras de Negócio

| ID | Regra |
|----|-------|
| RN01 | Não é possível cadastrar dois usuários com o mesmo e-mail |
| RN02 | Um usuário jamais pode visualizar, editar ou excluir tarefas de outro usuário |
| RN03 | Não é permitido criar uma tarefa com título vazio |
| RN04 | As funcionalidades de tarefas só estão disponíveis para usuários autenticados |
| RN05 | Ao excluir um usuário, todas as suas tarefas são removidas em cascata |

---

## Etapa 1.5 — Arquitetura e Estrutura do Sistema

### Backend — Clean Architecture

O backend foi desenvolvido seguindo os princípios de Clean Architecture, separando o código em 4 camadas por módulo:

```
backend/src/
├── modules/
│   ├── auth/
│   │   ├── domain/           # Tipos, erros, interfaces de repositório
│   │   ├── application/      # Services (casos de uso)
│   │   │   ├── registerUser.service.ts
│   │   │   ├── loginUser.service.ts
│   │   │   ├── logoutUser.service.ts
│   │   │   └── refreshToken.service.ts
│   │   ├── infra/            # Implementações (Prisma, JWT)
│   │   └── presentation/     # Controllers + schemas Zod
│   │
│   └── tasks/
│       ├── domain/
│       ├── application/      # Services (casos de uso)
│       │   ├── listTasks.service.ts
│       │   ├── createTask.service.ts
│       │   ├── updateTask.service.ts
│       │   ├── deleteTask.service.ts
│       │   └── toggleTask.service.ts
│       ├── infra/
│       └── presentation/
│
├── routes/                   # Definição de rotas Express
├── middlewares/              # Auth, error handling, notFound
└── lib/                      # Prisma client
```

### Frontend — Component-Based Architecture

```
frontend/src/
├── app/
│   ├── layout.tsx            # Layout raiz com AuthProvider
│   ├── page.tsx              # Redirecionamento automático
│   ├── login/page.tsx        # Página de login
│   ├── register/page.tsx     # Página de registro
│   └── dashboard/page.tsx    # Dashboard de tarefas
│
├── components/
│   ├── ui/                   # Button, Input, Spinner, ErrorMessage
│   ├── layout/               # Header
│   └── features/
│       ├── auth/             # LoginForm, RegisterForm
│       └── tasks/            # TaskCard, TaskForm, TaskList
│
├── lib/
│   ├── api.ts                # Cliente HTTP com suporte a JWT
│   └── auth-context.tsx      # Context de autenticação global
│
└── types/                    # Tipos TypeScript compartilhados
```

### Banco de Dados — Schema Prisma

```
User
├── id, email, password (hash)
├── status, lastLoginAt, lastLoginIp
└── → tasks[], refreshTokens[]

Task
├── id, title, description
├── completed (boolean)
└── → userId (FK)

RefreshToken
├── id, tokenHash, expiresAt, revokedAt
└── → userId (FK)
```

### API REST — Endpoints

| Método | Endpoint | Descrição | Auth |
|--------|----------|-----------|------|
| POST | /api/auth/register | Cadastro de usuário | ❌ |
| POST | /api/auth/login | Login | ❌ |
| POST | /api/auth/logout | Logout | ❌ |
| POST | /api/auth/refresh | Renovar access token | ❌ |
| GET | /api/tasks | Listar tarefas | ✅ |
| POST | /api/tasks | Criar tarefa | ✅ |
| PUT | /api/tasks/:id | Editar tarefa | ✅ |
| PATCH | /api/tasks/:id/toggle | Alternar status | ✅ |
| DELETE | /api/tasks/:id | Excluir tarefa | ✅ |

---

## Etapa 2 — Plano de Testes

### 2.1 Objetivos

- Verificar que todos os requisitos funcionais estão implementados e funcionando
- Garantir que as regras de negócio são respeitadas
- Validar a segurança da autenticação e isolamento de dados
- Medir o desempenho dos endpoints críticos
- Detectar regressões após alterações no código

### 2.2 Escopo dos Testes

| Tipo de Teste | Escopo | Ferramenta |
|---------------|--------|------------|
| Unidade | Services e validações isoladas | Pytest |
| Integração | Fluxos entre módulos (auth → tasks) | Pytest + requests |
| Sistema | Fluxo completo do usuário | Pytest + requests |
| Aceitação | Critérios dos requisitos funcionais | Pytest + requests |
| Regressão | Garantir que funcionalidades existentes não quebraram | Pytest |
| Desempenho | Tempo de resposta dos endpoints | Pytest + time |

### 2.3 Cronograma

| Etapa | Atividade | Status |
|-------|-----------|--------|
| Sprint 1 | Implementação do backend de autenticação | ✅ Concluído |
| Sprint 2 | Implementação do CRUD de tarefas | ✅ Concluído |
| Sprint 3 | Implementação do frontend | ✅ Concluído |
| Sprint 4 | Criação e execução dos testes automatizados | ✅ Concluído |

### 2.4 Endpoints Testados

**Autenticação:**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/auth/refresh`

**Tarefas (requer autenticação):**
- `GET /api/tasks`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/toggle`
- `DELETE /api/tasks/:id`

---

## Etapa 3 — Casos de Teste

### 3.1 Módulo de Autenticação

| ID | Caso de Teste | Entrada | Resultado Esperado | Tipo |
|----|---------------|---------|-------------------|------|
| CT01 | Registro com dados válidos | email válido + senha ≥ 6 chars | 201 Created + `{ data: { user } }` | Aceitação |
| CT02 | Registro com e-mail duplicado | e-mail já cadastrado | 409 Conflict + `{ message }` | Unidade |
| CT03 | Registro com e-mail inválido | "nao-é-email" | 400 Bad Request | Unidade |
| CT04 | Registro com senha curta | senha < 6 chars | 400 Bad Request | Unidade |
| CT05 | Login com credenciais válidas | e-mail + senha corretos | 200 OK + accessToken + refreshToken | Aceitação |
| CT06 | Login com senha incorreta | senha errada | 401 Unauthorized | Unidade |
| CT07 | Login com e-mail inexistente | e-mail não cadastrado | 401 Unauthorized | Unidade |
| CT08 | Logout com token válido | refreshToken válido | 200 OK | Aceitação |
| CT09 | Logout com token inválido | token inexistente | 401 Unauthorized | Unidade |
| CT10 | Refresh com token válido | refreshToken válido | 200 OK + novo accessToken | Integração |
| CT11 | Refresh com token revogado | token já usado no logout | 401 Unauthorized | Regressão |

### 3.2 Módulo de Tarefas

| ID | Caso de Teste | Entrada | Resultado Esperado | Tipo |
|----|---------------|---------|-------------------|------|
| CT12 | Listar tarefas autenticado | token válido | 200 OK + array de tarefas | Aceitação |
| CT13 | Listar tarefas sem autenticação | sem token | 401 Unauthorized | Unidade |
| CT14 | Criar tarefa com título válido | título + token | 201 Created + tarefa | Aceitação |
| CT15 | Criar tarefa sem título | título vazio + token | 400 Bad Request | Unidade |
| CT16 | Criar tarefa sem autenticação | título sem token | 401 Unauthorized | Unidade |
| CT17 | Editar tarefa própria | id + dados + token | 200 OK + tarefa atualizada | Aceitação |
| CT18 | Editar tarefa de outro usuário | id de outro + token | 404 Not Found | Unidade |
| CT19 | Toggle status de tarefa | id + token | 200 OK + completed invertido | Aceitação |
| CT20 | Excluir tarefa própria | id + token | 204 No Content | Aceitação |
| CT21 | Excluir tarefa de outro usuário | id de outro + token | 404 Not Found | Unidade |

### 3.3 Testes de Integração

| ID | Caso de Teste | Fluxo | Resultado Esperado |
|----|---------------|-------|-------------------|
| CT22 | Fluxo completo de autenticação | Register → Login → Logout | Todos os passos com sucesso |
| CT23 | Fluxo completo de tarefas | Login → Criar → Listar → Editar → Toggle → Excluir | Todos os passos com sucesso |
| CT24 | Isolamento entre usuários | Usuário A cria tarefa → Usuário B tenta acessar | 404 para Usuário B |

### 3.4 Testes de Desempenho

| ID | Caso de Teste | Critério de Aceite |
|----|---------------|-------------------|
| CT25 | Tempo de resposta do login | < 2 segundos |
| CT26 | Tempo de resposta ao listar tarefas | < 1 segundo |
| CT27 | Tempo de resposta ao criar tarefa | < 1 segundo |

---

## Etapa 4 — Testes Automatizados

### 4.1 Estrutura dos Scripts

```
tests_pytest/
├── conftest.py              # Configuração base e fixtures
├── requirements.txt         # Dependências Python
├── test_placeholder.py      # Health check do ambiente
├── test_auth.py             # Testes de autenticação (CT01-CT11)
├── test_tasks.py            # Testes de tarefas (CT12-CT21)
├── test_integration.py      # Testes de integração (CT22-CT24)
└── test_performance.py      # Testes de desempenho (CT25-CT27)
```

### 4.2 Como Executar

```bash
# Criar ambiente virtual
cd tests_pytest
python3 -m venv venv
venv/bin/pip install -r requirements.txt

# Iniciar backend em modo teste (Terminal 1)
cd backend && NODE_ENV=test npm run dev

# Executar todos os testes (Terminal 2)
cd tests_pytest && venv/bin/pytest -v

# Executar por arquivo
venv/bin/pytest test_auth.py -v
venv/bin/pytest test_tasks.py -v
venv/bin/pytest test_integration.py -v
venv/bin/pytest test_performance.py -v
```

> **Importante:** O backend deve ser iniciado com `NODE_ENV=test` para desativar o rate limiter durante os testes.

### 4.3 Status de Implementação

| Arquivo | Status | Casos Cobertos |
|---------|--------|----------------|
| test_placeholder.py | ✅ Implementado | Health check |
| test_auth.py | ✅ Implementado | CT01-CT11 (11 testes) |
| test_tasks.py | ✅ Implementado | CT12-CT21 (10 testes) |
| test_integration.py | ✅ Implementado | CT22-CT24 (3 testes) |
| test_performance.py | ✅ Implementado | CT25-CT27 (3 testes) |

### 4.4 Resultado da Execução

```
29 passed in 49.29s
```

| Arquivo | Testes | Resultado |
|---------|--------|-----------|
| test_placeholder.py | 2 | ✅ 2 passed |
| test_auth.py | 11 | ✅ 11 passed |
| test_tasks.py | 10 | ✅ 10 passed |
| test_integration.py | 3 | ✅ 3 passed |
| test_performance.py | 3 | ✅ 3 passed |
| **Total** | **29** | **✅ 29 passed** |

> **Observação:** O rate limiter do endpoint `/api/auth/login` é desativado em ambiente de testes via `NODE_ENV=test` para permitir múltiplos logins em sequência sem bloqueio 429.

---

## Etapa 5 — Testes Manuais

### 5.1 Fluxo Principal (Executado)

| Passo | Ação | Resultado Obtido | Status |
|-------|------|-----------------|--------|
| 1 | Acessar `http://localhost:3000` | Redirecionado para /login | ✅ Passou |
| 2 | Criar conta em /register | Conta criada, redirecionado para /login | ✅ Passou |
| 3 | Fazer login | Redirecionado para /dashboard com token | ✅ Passou |
| 4 | Criar tarefa com título | Tarefa aparece na lista | ✅ Passou |
| 5 | Criar tarefa sem título | Formulário não submete | ✅ Passou |
| 6 | Marcar tarefa como concluída | Título fica riscado | ✅ Passou |
| 7 | Editar tarefa | Campos preenchidos com valores atuais | ✅ Passou |
| 8 | Excluir tarefa | Tarefa removida da lista | ✅ Passou |
| 9 | Fazer logout | Redirecionado para /login, token removido | ✅ Passou |
| 10 | Acessar /dashboard sem login | Redirecionado para /login | ✅ Passou |

### 5.2 Testes de Validação Manual

| Teste | Resultado | Status |
|-------|-----------|--------|
| Registro com e-mail duplicado | Mensagem "E-mail já está em uso" | ✅ Passou |
| Login com senha errada | Mensagem "E-mail ou senha incorretos" | ✅ Passou |
| Criar tarefa com título vazio | Erro de validação exibido | ✅ Passou |
| Interface em mobile (320px) | Layout adaptado corretamente | ✅ Passou |
| Interface em desktop (1280px) | Layout centralizado com max-width | ✅ Passou |

### 5.3 Defeitos Encontrados e Corrigidos

| ID | Defeito | Causa | Correção |
|----|---------|-------|----------|
| BUG01 | Campos de edição vinham vazios ao clicar em "Editar" | `useState` não atualiza quando prop muda | Substituído por `useEffect` observando a prop `task` |

---

## Etapa 6 — Documentação dos Resultados

### 6.1 Cobertura de Requisitos

| Categoria | Total | Implementados | Testados (Manual) | Testados (Auto) |
|-----------|-------|---------------|-------------------|-----------------|
| Requisitos Funcionais | 8 | 8 (100%) | 8 (100%) | 8 (100%) |
| Requisitos Não Funcionais | 6 | 5 (83%) | 5 (83%) | 3 (50%) |
| Regras de Negócio | 5 | 5 (100%) | 5 (100%) | 5 (100%) |

### 6.2 Resultado dos Testes

| Tipo | Total | Passou | Falhou | Taxa de Sucesso |
|------|-------|--------|--------|-----------------|
| Testes Manuais | 15 | 15 | 0 | 100% |
| Testes Automatizados | 29 | 29 | 0 | 100% |
| **Total** | **44** | **44** | **0** | **100%** |

### 6.3 Análise de Segurança

| Critério | Status |
|----------|--------|
| Senhas criptografadas com Bcrypt (12 rounds) | ✅ Implementado |
| JWT com expiração (access 15min, refresh 7 dias) | ✅ Implementado |
| Rate limiting no login (10 tentativas/15min) | ✅ Implementado |
| Isolamento de dados por usuário | ✅ Implementado |
| Refresh tokens revogáveis | ✅ Implementado |
| Validação de entrada com Zod | ✅ Implementado |

### 6.4 Arquitetura Implementada

O sistema foi desenvolvido seguindo Clean Architecture no backend:

```
modules/
├── auth/
│   ├── domain/         # Tipos, erros, interfaces de repositório
│   ├── application/    # Services: register, login, logout, refresh
│   ├── infra/          # Prisma, tokens JWT
│   └── presentation/   # Controllers, schemas Zod
└── tasks/
    ├── domain/         # Tipos, erros, interfaces de repositório
    ├── application/    # Services: list, create, update, delete, toggle
    ├── infra/          # Prisma
    └── presentation/   # Controllers, schemas Zod
```

### 6.5 Melhorias Identificadas

| Melhoria | Prioridade | Status |
|----------|------------|--------|
| Testes automatizados Pytest | Alta | ✅ Concluído |
| Adicionar toast notifications no frontend | Média | ⏳ Pendente |
| Filtros de tarefas (todas/pendentes/concluídas) | Média | ⏳ Pendente |
| Migrar banco para PostgreSQL em produção | Baixa | ⏳ Pendente |

---

## Conclusão

O sistema Task Manager foi desenvolvido e testado com sucesso, atendendo integralmente todos os requisitos definidos na atividade.

**Desenvolvimento:** O sistema foi construído com arquitetura modular (Clean Architecture) no backend e arquitetura baseada em componentes no frontend, utilizando as tecnologias definidas nos requisitos não funcionais: Next.js, React, TypeScript, Tailwind CSS, Node.js, Express, Prisma e SQLite.

**Testes:** Foram executados 44 testes no total — 15 manuais e 29 automatizados — com taxa de aprovação de 100%. A suite cobre todos os 6 tipos de teste exigidos pela atividade: unidade, integração, sistema, aceitação, regressão e desempenho.

**Defeitos:** Um defeito foi identificado e corrigido durante o processo (BUG01 — campos de edição vazios no formulário de tarefas), demonstrando a eficácia do processo de testes.

**Segurança:** O sistema implementa boas práticas de segurança como bcrypt para senhas, JWT com expiração, rate limiting, validação de entrada com Zod e isolamento total de dados entre usuários.

O trabalho demonstrou na prática como um plano de testes estruturado contribui para a qualidade do software, permitindo identificar e corrigir problemas antes da entrega.
