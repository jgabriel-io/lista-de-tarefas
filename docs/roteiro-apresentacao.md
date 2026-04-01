# Roteiro de Apresentação — Task Manager
## Qualidade e Testes de Software

**Tempo total:** 15 minutos  
**Integrantes:** João Gabriel e Rhuan

---

## Slide 1 — Capa (30s)

> "Bom dia/Boa tarde. Nosso trabalho é sobre o Task Manager, um sistema web de gerenciamento de tarefas pessoais com autenticação segura. O objetivo foi desenvolver um plano de testes completo para esse sistema, cobrindo todos os tipos de teste exigidos na atividade."

---

## Slide 2 — O Sistema (1min)

> "O Task Manager permite que usuários se cadastrem, façam login e gerenciem suas próprias tarefas — criar, listar, editar, marcar como concluída e excluir."

> "A stack é composta por Next.js no frontend, Node.js com Express no backend e SQLite como banco de dados. A autenticação é feita via JWT com Bcrypt para as senhas."

> "O sistema foi desenvolvido do zero justamente para servir como base real para os testes que vamos apresentar."

---

## Slide 3 — Levantamento de Requisitos (2min)

> "Levantamos três categorias de requisitos."

> "Os Requisitos Funcionais, RF01 a RF08, descrevem o que o sistema deve fazer: cadastro, login, logout e o CRUD completo de tarefas."

> "Os Requisitos Não Funcionais definem as restrições de qualidade. Destacamos o RNF02 — senhas criptografadas com Bcrypt — e o RNF06 — uso de TypeScript tanto no frontend quanto no backend para garantir tipagem e reduzir erros."

> "As Regras de Negócio definem as leis do sistema. A mais crítica é a RN02: um usuário jamais pode ver ou modificar tarefas de outro usuário. Isso foi testado e validado."

---

## Slide 4 — Plano de Testes (2min)

> "Aplicamos os 6 tipos de teste exigidos na atividade."

> "Teste de Unidade: validamos cada endpoint de forma isolada, por exemplo, tentar criar uma tarefa sem título deve retornar 400."

> "Teste de Integração: verificamos o fluxo entre módulos, como o fluxo de autenticação que passa pelo módulo de auth e depois acessa o módulo de tarefas."

> "Teste de Sistema: executamos o fluxo completo do usuário, do registro até o logout."

> "Teste de Aceitação: validamos diretamente cada requisito funcional."

> "Teste de Regressão: garantimos que após corrigir o BUG01, nada que funcionava parou de funcionar."

> "Teste de Desempenho: medimos o tempo de resposta dos endpoints críticos, com limite de 2 segundos para login e 1 segundo para as demais operações."

---

## Slide 5 — Casos de Teste (2min)

> "Para cada funcionalidade criamos cenários válidos e inválidos."

> "Por exemplo, o CT05 testa o login com credenciais corretas — esperamos 200 OK com o token JWT. Já o CT06 testa o login com senha errada — esperamos 401 Unauthorized."

> "O CT14 testa a criação de tarefa com título válido — esperamos 201 Created. O CT15 testa com título vazio — esperamos 400 Bad Request."

> "No total documentamos 27 casos de teste, cobrindo autenticação, tarefas, integração e desempenho."

---

## Slide 6 — Testes Automatizados (2min)

> "Implementamos os testes em Python usando Pytest, organizados em 4 arquivos: test_auth, test_tasks, test_integration e test_performance."

> "Para executar, subimos o backend em modo de teste com NODE_ENV=test para desativar o rate limiter, e rodamos o comando pytest -v."

> "O resultado foi 29 testes passando em 49 segundos, com 100% de aprovação."

**→ EXECUTAR OS TESTES AO VIVO AQUI**
```bash
# Terminal 1
cd backend && NODE_ENV=test npm run dev

# Terminal 2
cd tests_pytest && venv/bin/pytest -v
```

---

## Slide 7 — Testes Manuais (2min)

> "Além dos testes automatizados, executamos testes manuais cobrindo o fluxo completo: registro, login, criar tarefa, editar, excluir e logout."

> "Durante os testes manuais identificamos o BUG01: ao clicar em Editar em uma tarefa, os campos do formulário vinham vazios em vez de preenchidos com os valores atuais."

> "A causa foi que o useState do React inicializa apenas uma vez e não reage a mudanças na prop. A correção foi substituir por useEffect observando a prop da tarefa."

> "Esse é um exemplo prático de como os testes manuais complementam os automatizados — esse tipo de bug de UX não seria capturado por testes de API."

**→ DEMO DO SISTEMA AO VIVO AQUI**
- Abrir `http://localhost:3000`
- Criar conta → Login → Criar tarefa → Editar → Toggle → Excluir → Logout

---

## Slide 8 — Resultados (1min)

> "Consolidando os resultados: executamos 44 testes no total, sendo 15 manuais e 29 automatizados, com 100% de aprovação."

> "Cobrimos 8 de 8 requisitos funcionais e protegemos todas as 5 regras de negócio, incluindo o isolamento total de dados entre usuários."

---

## Slide 9 — Conclusão (1min)

> "O trabalho mostrou na prática a importância de um plano de testes estruturado."

> "O BUG01 foi identificado e corrigido antes da entrega justamente por causa dos testes manuais. Sem esse processo, o bug chegaria ao usuário final."

> "A Clean Architecture adotada no backend facilitou muito a testabilidade, já que cada camada tem responsabilidade única e pode ser testada de forma isolada."

> "O projeto está 100% funcional, com todos os requisitos implementados e validados."

---

## Slide 10 — Agradecimento (30s)

> "É isso. Obrigado pela atenção. Ficamos à disposição para perguntas."

---

## Dicas para a Apresentação

- Abrir o sistema e o terminal antes de começar
- Ter o backend rodando em modo teste: `NODE_ENV=test npm run dev`
- Ter o frontend rodando: `npm run dev`
- Ter o terminal de testes pronto: `cd tests_pytest`
- Falar com calma, 15 minutos é tempo suficiente
