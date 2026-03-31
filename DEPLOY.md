# Deploy - Task Manager

## 🚀 Opção 1: Vercel (Recomendado - Mais Simples)

### Frontend (Next.js)

1. **Conectar repositório no Vercel:**
   - Acesse [vercel.com](https://vercel.com)
   - Import Git Repository
   - Selecione seu repo

2. **Configurar:**
   - Root Directory: `frontend`
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: `.next`

3. **Variáveis de Ambiente:**
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.vercel.app
   ```

4. **Deploy:**
   - Clique em "Deploy"
   - ✅ Frontend no ar!

### Backend (Express + Prisma)

**Problema:** Vercel não suporta Express diretamente. Você tem 3 opções:

#### A) Railway (Recomendado para Express)
1. Acesse [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Selecione o repo
4. Root Directory: `backend`
5. Variáveis de ambiente:
   ```
   DATABASE_URL=file:./prod.db
   JWT_SECRET=seu_secret_super_seguro_aqui
   PORT=3001
   ```
6. ✅ Backend no ar!

#### B) Render
1. Acesse [render.com](https://render.com)
2. New Web Service
3. Connect repository
4. Root Directory: `backend`
5. Build Command: `npm install && npm run build`
6. Start Command: `npm start`
7. Variáveis de ambiente (mesmas acima)

#### C) Fly.io
1. Instale Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. `cd backend && fly launch`
3. Configure variáveis de ambiente
4. `fly deploy`

---

## 🚀 Opção 2: Cloudflare Pages (Frontend) + Railway (Backend)

### Frontend na Cloudflare Pages

1. **Conectar repositório:**
   - Acesse [pages.cloudflare.com](https://pages.cloudflare.com)
   - Create a project
   - Connect to Git

2. **Configurar:**
   - Build command: `npm run build`
   - Build output directory: `.next`
   - Root directory: `frontend`

3. **Variáveis de Ambiente:**
   ```
   NEXT_PUBLIC_API_URL=https://seu-backend.railway.app
   NODE_VERSION=18
   ```

4. **Deploy:**
   - Save and Deploy
   - ✅ Frontend no ar!

### Backend no Railway
(Mesmas instruções da Opção 1A)

---

## 🚀 Opção 3: Tudo no Railway (Mais Simples)

1. Acesse [railway.app](https://railway.app)
2. New Project → Deploy from GitHub
3. Railway detecta automaticamente frontend e backend
4. Configure variáveis de ambiente em cada serviço
5. ✅ Tudo no ar!

---

## ⚠️ Importante: SQLite em Produção

SQLite funciona, mas tem limitações:
- ✅ Bom para MVP e projetos pequenos
- ❌ Dados são perdidos se o container reiniciar (Railway/Render)
- ❌ Não escala horizontalmente

### Solução: Migrar para PostgreSQL

**1. Atualizar schema.prisma:**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**2. Usar banco gerenciado:**
- Railway: PostgreSQL grátis incluído
- Vercel: Vercel Postgres
- Supabase: PostgreSQL grátis

**3. Rodar migration:**
```bash
npm run prisma:migrate
```

---

## 🔧 Configuração Recomendada

### Para MVP/Teste
- **Frontend:** Cloudflare Pages (grátis, rápido)
- **Backend:** Railway (grátis, fácil)
- **Banco:** SQLite (temporário)

### Para Produção
- **Frontend:** Cloudflare Pages ou Vercel
- **Backend:** Railway ou Render
- **Banco:** PostgreSQL (Railway/Supabase)

---

## 📝 Checklist de Deploy

### Antes de fazer deploy:
- [ ] Criar `.env` de produção com JWT_SECRET forte
- [ ] Configurar CORS no backend para aceitar domínio do frontend
- [ ] Testar localmente com `npm run build`
- [ ] Verificar se todas as variáveis de ambiente estão configuradas

### Após deploy:
- [ ] Testar registro de usuário
- [ ] Testar login
- [ ] Testar CRUD de tarefas
- [ ] Verificar logs de erro
- [ ] Configurar domínio customizado (opcional)

---

## 🎯 Recomendação Final

**Para começar rápido:**
1. Frontend na **Cloudflare Pages** (grátis, CDN global)
2. Backend no **Railway** (grátis, suporta Express + Prisma)
3. Migrar para PostgreSQL quando crescer

**Custo:** R$ 0,00 (planos gratuitos)
**Tempo de setup:** ~15 minutos
