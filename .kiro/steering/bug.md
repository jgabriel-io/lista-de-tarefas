---
inclusion: manual
---

# Corrigindo um Bug

## 1. Classificar o bug

- **Comportamento (UI/UX)**: algo visual ou de interação não funciona como esperado
- **Lógica / regra de negócio**: resultado incorreto, dado errado, fluxo quebrado
- **Pacote externo**: comportamento inesperado de uma dependência

## 2. Bug de comportamento (UI/UX)

1. Reproduzir o bug localmente
2. Inspecionar o componente e seus estados
3. Verificar se o problema é de CSS, lógica condicional ou estado

## 3. Bug de lógica

1. Rastrear o stack trace completo
2. Identificar se o erro está na camada de route, controller, service ou banco
3. Verificar se o erro é pré-existente ou introduzido pela tarefa atual
4. Corrigir apenas o que é responsabilidade da tarefa atual; reportar o resto

## 4. Bug de pacote

1. Identificar a versão exata no `package.json`
2. Pesquisar issues no GitHub do pacote
3. Verificar se há workaround documentado
4. Nunca atualizar a versão do pacote sem validar impacto

## Regra

Erros pré-existentes devem ser reportados ao usuário, mas não bloqueiam a entrega da tarefa atual.
