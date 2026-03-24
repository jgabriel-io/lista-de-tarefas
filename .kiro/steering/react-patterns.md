---
inclusion: fileMatch
fileMatchPattern: "**/*.{jsx,tsx}"
---

# React Patterns

## Named Exports

`export default` apenas para páginas Next.js. Todo o resto usa `export const`.

```tsx
// ❌
export default function TaskCard() { ... }

// ✅
export const TaskCard = ({ title }: TaskCardProps) => { ... }
```

## Props sem React.FC

```tsx
// ❌
const Button: React.FC<ButtonProps> = ({ text }) => ...

// ✅
const Button = ({ text }: ButtonProps) => { return <button>{text}</button> }
```

## Imports do React

```tsx
// ❌
import React from 'react'
type Props = { icon: React.ReactNode }

// ✅
import { ReactNode } from 'react'
type Props = { icon: ReactNode }
```

## Um componente por arquivo

Nunca agrupar múltiplos componentes no mesmo arquivo.

## Estados obrigatórios da UI

Todo componente que faz fetch deve cobrir: `loading`, `error`, `empty`, `success`.

```tsx
if (loading) return <Spinner />
if (error) return <ErrorMessage message={error} />
if (!tasks.length) return <EmptyState />
return <TaskList tasks={tasks} />
```

## Sempre usar return explícito

```tsx
// ❌
const Badge = () => <span>ok</span>

// ✅
const Badge = () => {
  return <span>ok</span>
}
```
