# Quick Start - Task Manager

## 🚀 Rodar o Projeto em 3 Passos

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run dev
```

✅ Backend rodando em `http://localhost:3001`

### 2. Frontend

```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

✅ Frontend rodando em `http://localhost:3000`

### 3. Acessar

Abra `http://localhost:3000` no navegador:
1. Clique em "Criar conta"
2. Cadastre-se com e-mail e senha
3. Faça login
4. Comece a criar tarefas!

---

## 🧪 Testar API

```bash
cd backend
./test-api.sh
```

---

## 📁 Estrutura Criada

### Backend (Arquitetura Modular)
```
modules/
├── auth/
│   ├── domain/         # Tipos, erros, interfaces
│   ├── application/    # Services (register, login, logout, refresh)
│   ├── infra/          # Prisma, tokens
│   └── presentation/   # Controllers, schemas Zod
└── tasks/
    ├── domain/
    ├── application/    # Services (list, create, update, delete, toggle)
    ├── infra/
    └── presentation/
```

### Frontend (Component-Based)
```
app/
├── login/          # Página de login
├── register/       # Página de registro
└── dashboard/      # Dashboard de tarefas

components/
├── ui/             # Button, Input, Spinner, ErrorMessage
├── layout/         # Header
└── features/
    ├── auth/       # LoginForm, RegisterForm
    └── tasks/      # TaskCard, TaskForm, TaskList
```

---

## ✅ Funcionalidades Implementadas

### Autenticação
- [x] Registro com validação de e-mail único
- [x] Login com JWT (access + refresh tokens)
- [x] Logout com revogação de tokens
- [x] Refresh token automático
- [x] Rate limiting (10 tentativas/15min)

### Tarefas
- [x] CRUD completo
- [x] Toggle de status (concluída/pendente)
- [x] Validação de título obrigatório
- [x] Isolamento por usuário
- [x] Interface responsiva

---

## 🎯 Próximos Passos (Sprint 4)

- [ ] Testes automatizados (Pytest)
- [ ] Documentação da API
- [ ] Melhorias de UX (toast notifications, loading states)
- [ ] Deploy (Docker, CI/CD)
