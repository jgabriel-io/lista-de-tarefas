---
inclusion: manual
---

# Code Review

Princípio: funcionar primeiro, refatorar depois. Simples agora, sustentável amanhã.

## Backend
- Sem N+1 queries no Prisma
- Status codes corretos (400, 401, 403, 404, 500)
- Lógica de negócio apenas nos services
- Respostas consistentes: `{ data }` sucesso, `{ message }` erro
- Nenhum campo `password` exposto em responses

## Frontend
- Estados cobertos: loading, error, empty, success
- Sem re-renders desnecessários
- Sem abstrações prematuras

## Banco de Dados
- Migrations para toda alteração de schema
- Validar ownership antes de update/delete (userId)
- Sem campos genéricos tipo `data JSON`

## Segurança
- Inputs sanitizados
- Dados sensíveis fora de logs e responses
- JWT validado em todas as rotas protegidas
- Zero credenciais hardcoded

## Manutenibilidade
- Funções com responsabilidade única
- Sem comentários que explicam o óbvio
- Trade-offs documentados quando a decisão não é óbvia
