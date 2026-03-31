# Task Manager

Sistema completo de gerenciamento de tarefas com autenticação JWT, construído com arquitetura modular.

## Stack

- **Frontend:** Next.js 14 (App Router) • React 18 • TypeScript • Tailwind CSS
- **Backend:** Node.js • Express • TypeScript • Prisma • SQLite
- **Autenticação:** JWT (Access + Refresh Tokens) • Bcrypt
- **Testes:** Pytest

---

## Funcionalidades

### Autenticação
- ✅ Registro de usuários com validação
- ✅ Login com JWT (access token 15min + refresh token 7 dias)
- ✅ Logout com revogação de tokens
- ✅ Refresh token automático
- ✅ Rate limiting (10 tentativas/15min)
- ✅ Auditoria de login (IP, data)

### Gestão de Tarefas
- ✅ Criar tarefas com título e descrição
- ✅ Listar tarefas do usuário
- ✅ Editar tarefas
- ✅ Marcar como concluída/pendente
- ✅ Excluir tarefas
- ✅ Isolamento total por usuário

---

## Estrutura do Projeto

```
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   ├── auth/          # Módulo de autenticação
│   │   │   │   ├── domain/    # Tipos, erros, interfaces
│   │   │   │   ├── application/ # Services (casos de uso)
│   │   │   │   ├── infra/     # Prisma, tokens
│   │   │   │   └── presentation/ # Controllers, schemas Zod
│   │   │   └── tasks/         # Módulo de tarefas
│   │   │       ├── domain/
│   │   │       ├── application/
│   │   │       ├── infra/
│   │   │       └── presentation/
│   │   ├── routes/            # Definição de rotas
│   │   ├── middlewares/       # Auth, error handling
│   │   └── lib/               # Prisma client
│   └── prisma/
│       └── schema.prisma      # Schema do banco
│
├── frontend/
│   └── src/
│       ├── app/               # Páginas Next.js
│       │   ├── login/
│       │   ├── register/
│       │   └── dashboard/
│       ├── components/
│       │   ├── ui/            # Button, Input, Spinner
│       │   ├── layout/        # Header
│       │   └── features/      # Auth, Tasks
│       ├── lib/               # API, Context
│       └── types/             # TypeScript types
│
└── tests_pytest/              # Testes automatizados
```

---

## Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Backend

```bash
cd backend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Edite o .env e configure JWT_SECRET

# Gerar Prisma Client
npm run prisma:generate

# Rodar migrations
npm run prisma:migrate

# Iniciar servidor
npm run dev
```

O backend estará rodando em `http://localhost:3001`

### Frontend

```bash
cd frontend

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.local.example .env.local

# Iniciar aplicação
npm run dev
```

O frontend estará rodando em `http://localhost:3000`

---

## API Endpoints

### Autenticação
- `POST /api/auth/register` - Criar conta
- `POST /api/auth/login` - Fazer login
- `POST /api/auth/logout` - Fazer logout
- `POST /api/auth/refresh` - Renovar access token

### Tarefas (requer autenticação)
- `GET /api/tasks` - Listar tarefas
- `POST /api/tasks` - Criar tarefa
- `PUT /api/tasks/:id` - Atualizar tarefa
- `PATCH /api/tasks/:id/toggle` - Alternar status
- `DELETE /api/tasks/:id` - Excluir tarefa

---

## Testes

### Testes automatizados (Pytest)
```bash
# Criar ambiente virtual
cd tests_pytest
python3 -m venv venv
venv/bin/pip install -r requirements.txt

# Iniciar backend em modo teste (Terminal 1)
cd backend && NODE_ENV=test npm run dev

# Executar testes (Terminal 2)
cd tests_pytest && venv/bin/pytest -v
```

29 testes automatizados cobrindo: autenticação, tarefas, integração e desempenho.

---

## Arquitetura

### Backend - Clean Architecture
- **Domain:** Entidades, erros, interfaces de repositório
- **Application:** Services (casos de uso)
- **Infrastructure:** Implementações (Prisma, JWT)
- **Presentation:** Controllers, validação Zod

### Frontend - Component-Based
- **Pages:** Rotas Next.js (App Router)
- **Components:** UI base + Features por domínio
- **Lib:** API client, Context de autenticação
- **Types:** Definições TypeScript compartilhadas

---

## Segurança

- Senhas criptografadas com bcrypt (12 rounds)
- JWT com expiração (access 15min, refresh 7 dias)
- Rate limiting no login
- Validação de entrada com Zod
- Isolamento de dados por usuário
- Refresh tokens persistidos e revogáveis

---

## Documentação

- `docs/requisitos.md` - Requisitos funcionais, não funcionais e regras de negócio
- `docs/documentacao.md` - Plano de testes, casos de teste e relatório final
- `docs/apresentacao-task-manager.pdf` - Slides da apresentação

---

## Licença

MIT
