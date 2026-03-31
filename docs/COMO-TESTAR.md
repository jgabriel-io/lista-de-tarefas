# Como Testar o Task Manager

## 🚀 Iniciar o Projeto

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```
✅ Backend em `http://localhost:3001`

### 2. Frontend
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```
✅ Frontend em `http://localhost:3000`

---

## 🧪 Testes Manuais

### Fluxo Completo de Usuário

**1. Criar Conta**
- Acesse `http://localhost:3000`
- Será redirecionado para `/login`
- Clique em "Criar conta"
- Preencha e-mail e senha (mínimo 6 caracteres)
- Clique em "Criar Conta"
- ✅ Deve redirecionar para `/login`

**2. Fazer Login**
- Preencha e-mail e senha cadastrados
- Clique em "Entrar"
- ✅ Deve redirecionar para `/dashboard`
- ✅ Header deve mostrar seu e-mail

**3. Criar Tarefa**
- No formulário "Nova Tarefa"
- Digite um título (obrigatório)
- Digite uma descrição (opcional)
- Clique em "Criar Tarefa"
- ✅ Tarefa aparece na lista abaixo
- ✅ Formulário é limpo

**4. Marcar como Concluída**
- Clique no checkbox da tarefa
- ✅ Título fica riscado (line-through)
- ✅ Cor muda para cinza
- Clique novamente
- ✅ Volta ao estado normal

**5. Editar Tarefa**
- Clique em "Editar" em uma tarefa
- ✅ Formulário muda para "Editar Tarefa"
- ✅ Campos preenchidos com dados atuais
- Altere o título ou descrição
- Clique em "Atualizar"
- ✅ Tarefa atualizada na lista
- ✅ Formulário volta para "Nova Tarefa"

**6. Excluir Tarefa**
- Clique em "Excluir" em uma tarefa
- ✅ Aparece confirmação
- Confirme
- ✅ Tarefa removida da lista

**7. Fazer Logout**
- Clique em "Sair" no header
- ✅ Redirecionado para `/login`
- ✅ Tokens removidos
- Tente acessar `/dashboard` diretamente
- ✅ Deve redirecionar para `/login`

---

## 🔍 Testes de Validação

### Registro
- ❌ E-mail inválido → Erro de validação
- ❌ Senha < 6 caracteres → Erro de validação
- ❌ E-mail já cadastrado → "E-mail já está em uso"

### Login
- ❌ E-mail não cadastrado → "E-mail ou senha incorretos"
- ❌ Senha errada → "E-mail ou senha incorretos"
- ❌ Mais de 10 tentativas em 15min → Rate limit

### Tarefas
- ❌ Criar tarefa sem título → Erro de validação
- ❌ Editar tarefa com título vazio → "Título não pode ser vazio"
- ✅ Descrição opcional funciona

### Segurança
- ❌ Acessar `/dashboard` sem login → Redireciona para `/login`
- ❌ Fazer requisição sem token → 401 Unauthorized
- ✅ Usuário A não vê tarefas do usuário B

---

## 🧪 Testar API Diretamente

### Usando o script
```bash
cd backend
./test-api.sh
```

### Usando curl manualmente

**1. Registrar**
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

**2. Login**
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"123456"}'
```

Copie o `accessToken` da resposta.

**3. Criar Tarefa**
```bash
curl -X POST http://localhost:3001/api/tasks \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"title":"Minha tarefa","description":"Teste"}'
```

**4. Listar Tarefas**
```bash
curl -X GET http://localhost:3001/api/tasks \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**5. Toggle Status**
```bash
curl -X PATCH http://localhost:3001/api/tasks/1/toggle \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

**6. Atualizar Tarefa**
```bash
curl -X PUT http://localhost:3001/api/tasks/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -d '{"title":"Tarefa atualizada"}'
```

**7. Deletar Tarefa**
```bash
curl -X DELETE http://localhost:3001/api/tasks/1 \
  -H "Authorization: Bearer SEU_TOKEN_AQUI"
```

---

## 📱 Testes de Responsividade

### Desktop (1024px+)
- ✅ Layout centralizado com max-width
- ✅ Formulários com largura adequada
- ✅ Tarefas em cards espaçados

### Tablet (768px - 1023px)
- ✅ Layout adaptado
- ✅ Componentes responsivos

### Mobile (<768px)
- ✅ Layout mobile-first
- ✅ Botões e inputs touch-friendly
- ✅ Texto legível

---

## ✅ Checklist de Qualidade

### Código
- ✅ TypeScript sem `any`
- ✅ Sem `console.log` em produção
- ✅ Imports organizados
- ✅ Um componente por arquivo
- ✅ Props tipadas manualmente

### UI/UX
- ✅ 4 estados cobertos (loading, error, empty, success)
- ✅ Feedback visual para todas as ações
- ✅ Confirmação antes de excluir
- ✅ Mensagens de erro claras

### Segurança
- ✅ Senhas criptografadas
- ✅ JWT com expiração
- ✅ Rate limiting
- ✅ Validação de entrada
- ✅ Isolamento de dados

### Performance
- ✅ Sem re-renders desnecessários
- ✅ Validação no backend
- ✅ Queries otimizadas (Prisma)

---

## 🐛 Problemas Conhecidos

Nenhum problema conhecido no momento.

---

## 📝 Próximos Passos

Ver `sprints.md` para Sprint 4 (Testes e Deploy).
