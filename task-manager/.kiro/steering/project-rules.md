---
inclusion: always
---

# Task Manager — Regras do Projeto

## Stack
Next.js 14 (App Router) • React 18 • TypeScript • Tailwind CSS • Node.js • Express • Prisma • SQLite • JWT

---

## Estrutura de Pastas

### Frontend (`/frontend/src`)
```
app/              # Rotas Next.js (App Router)
components/
  ui/             # Componentes base reutilizáveis
  layout/         # Header, Footer, Sidebar
  features/       # Componentes por domínio (auth/, tasks/)
hooks/            # Custom hooks (use-*.ts)
lib/              # api.ts, utils
types/            # Interfaces e types TypeScript
```

### Backend (`/backend/src`)
```
routes/           # Definição de rotas
controllers/      # Recebe req/res, delega para services
services/         # Lógica de negócio
middlewares/      # Auth, validação
lib/              # prisma.ts e utilitários
```

---

## TypeScript

- Use `type` ao invés de `interface`
- Nunca use `any` — prefira `unknown` com narrowing
- Sempre tipar retorno de funções assíncronas (`Promise<T>`)
- Props de componentes: tipar manualmente, nunca usar `React.FC`

```tsx
// ❌ Errado
const Button: React.FC<ButtonProps> = ({ text }) => ...

// ✅ Correto
const Button = ({ text }: ButtonProps) => ...
```

---

## React / Next.js

- `export default` apenas para páginas Next.js (`app/**/page.tsx`, `layout.tsx`)
- Todos os outros componentes: `export const`
- Um componente por arquivo
- Sempre usar `return` explícito, mesmo em componentes simples
- Importar apenas o necessário do React (sem `import React from 'react'`)

```tsx
// ❌ Errado
import React from 'react'
const icon: React.ReactNode = ...

// ✅ Correto
import { ReactNode } from 'react'
const icon: ReactNode = ...
```

- Cobrir sempre os 4 estados da UI: `loading`, `error`, `empty`, `success`

---

## Tailwind CSS

- Zero valores hardcoded: sem pixels mágicos, sem HEX direto no código
- Usar classes utilitárias do Tailwind; criar tokens em `globals.css` para valores customizados
- Verificar `globals.css` antes de aplicar qualquer valor customizado
- Breakpoints: mobile-first (`md:` para 768px+, `lg:` para 1024px+)

```tsx
// ❌ Errado
<button style={{ backgroundColor: '#3A57E8', height: '42px' }}>

// ✅ Correto
<button className="bg-primary h-10 px-4 py-2 rounded-md">
```

---

## Organização de Imports

Ordem obrigatória, com itens em ordem alfabética dentro de cada bloco:

1. Pacotes externos (`next`, `react`, etc.)
2. Aliases com `@/` (`@/components`, `@/hooks`, `@/lib`)
3. Imports relativos (`./`, `../`)

```tsx
// ✅ Correto
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { apiFetch } from '@/lib/api'
import { TaskCard } from './TaskCard'
```

---

## Backend

- Sem lógica de negócio nos controllers — apenas receber req/res e delegar ao service
- Sempre retornar status codes corretos: `200`, `201`, `400`, `401`, `403`, `404`, `500`
- Estrutura de resposta consistente: `{ data }` para sucesso, `{ message }` para erro
- Variáveis sensíveis sempre em `.env`, nunca hardcoded
- Rotas protegidas sempre com `authMiddleware`

---

## Banco de Dados (Prisma)

- Toda alteração de schema via `prisma migrate dev`
- Nunca usar `prisma.$queryRaw` sem sanitização
- Sempre validar que o recurso pertence ao usuário autenticado antes de update/delete

---

## Segurança

- Senhas sempre com `bcrypt` (mínimo 10 rounds)
- JWT com expiração definida (`expiresIn: '7d'`)
- Nunca expor `password` em responses
- Inputs validados antes de chegar no service

---

## Proibições Gerais

- Sem `console.log` em produção
- Sem comentários explicando o óbvio
- Sem abstrações prematuras — se um `map()` ou `if` resolve, use
- Sem `any` no TypeScript
- Sem lógica de negócio fora dos services (backend) ou hooks/lib (frontend)
