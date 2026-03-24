---
inclusion: manual
---

# Executando uma Tarefa

Siga esta ordem antes de escrever qualquer código:

## 1. Entender o contexto

Identifique gaps na tarefa. Exemplo: "Criar formulário de login" — qual rota? qual validação? qual endpoint? qual payload?

Mencione os gaps antes de implementar.

## 2. Mapear o que já existe

Analise a codebase para reutilizar componentes, hooks e funções existentes antes de criar novos.

## 3. Definir o que será criado

Liste os componentes, hooks, services e rotas necessários, categorizados por camada (UI, hook, service, route).

## 4. Implementar

- Backend: route → controller → service → prisma
- Frontend: page → componente → hook → `lib/api.ts`
- Cobrir estados: `loading`, `error`, `empty`, `success`

## 5. Validar

Após implementar, verificar:
- [ ] Happy path funcionando
- [ ] Estados de erro tratados
- [ ] TypeScript sem erros
- [ ] Lint sem warnings
- [ ] Nenhum dado sensível exposto
