# Requisitos do Sistema - Task Manager

## 1. Requisitos Funcionais (RF)
*Descrevem as ações que o sistema deve permitir que o usuário realize.*

### **Módulo de Usuário (Autenticação)**
- **RF01 - Cadastro de Usuários:** O sistema deve permitir que um novo usuário se cadastre informando e-mail e senha.
- **RF02 - Login de Usuários:** O sistema deve permitir que o usuário cadastrado acesse sua conta via e-mail e senha.
- **RF03 - Logout:** O sistema deve permitir que o usuário encerre sua sessão de forma segura.

### **Módulo de Gestão de Tarefas (CRUD)**
- **RF04 - Criar Tarefa:** O usuário logado deve poder cadastrar uma nova tarefa com título e descrição opcional.
- **RF05 - Listar Tarefas:** O sistema deve exibir uma lista das tarefas cadastradas pelo usuário logado.
- **RF06 - Editar Tarefa:** O usuário deve poder alterar o título, a descrição ou o status de uma tarefa existente.
- **RF07 - Excluir Tarefa:** O usuário deve poder remover uma tarefa da sua lista permanentemente.
- **RF08 - Marcar como Concluída:** O usuário deve poder alternar o status da tarefa entre "Pendente" e "Concluída".

---

## 2. Requisitos Não Funcionais (RNF)
*Descrevem as características de qualidade, tecnologias e restrições do sistema.*

- **RNF01 - Persistência de Dados:** O sistema deve utilizar o banco de dados **SQLite** (via Prisma ORM) para garantir que os dados não sejam perdidos ao reiniciar o servidor.
- **RNF02 - Segurança de Senhas:** As senhas dos usuários devem ser armazenadas de forma criptografada no banco de dados utilizando **Bcrypt**.
- **RNF03 - Autenticação Segura:** A comunicação entre Frontend e Backend deve ser autenticada via **JWT (JSON Web Token)** enviado nos headers das requisições.
- **RNF04 - Interface Responsiva:** O frontend (Next.js + Tailwind) deve ser adaptável para visualização em dispositivos móveis e desktop.
- **RNF05 - Testabilidade:** O backend deve expor uma API RESTful clara para permitir a automação de testes via **Pytest (Python)**.
- **RNF06 - Padronização de Código:** O projeto deve utilizar **TypeScript** tanto no Frontend quanto no Backend para garantir tipagem e reduzir erros em tempo de execução.

---

## 3. Regras de Negócio (RN)
*Descrevem as "leis" e limitações lógicas que o sistema deve impor.*

- **RN01 - Unicidade de E-mail:** Não deve ser possível cadastrar dois usuários com o mesmo endereço de e-mail.
- **RN02 - Isolamento de Dados:** Um usuário **jamais** poderá visualizar, editar ou excluir tarefas que pertençam a outro usuário.
- **RN03 - Validação de Título:** Não é permitido criar uma tarefa com o campo de título vazio.
- **RN04 - Acesso Restrito:** As funcionalidades de gestão de tarefas (listar, criar, editar, excluir) só devem estar disponíveis para usuários devidamente autenticados.
- **RN05 - Integridade de Exclusão:** Ao excluir um usuário (se implementado no futuro), todas as suas tarefas vinculadas devem ser removidas (deleção em cascata).