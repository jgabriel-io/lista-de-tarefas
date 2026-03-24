---
inclusion: fileMatch
fileMatchPattern: "**/*.{ts,tsx}"
---

# TypeScript

- Use `type` ao invés de `interface`
- Nunca use `any` — prefira `unknown` com type narrowing
- Sempre tipar retorno de funções assíncronas

```ts
// ❌
async function getUser(id: number): Promise<any> { ... }

// ✅
async function getUser(id: number): Promise<User> { ... }
```

- Erros em catch: usar `unknown` com narrowing

```ts
// ✅
} catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Erro desconhecido'
}
```
