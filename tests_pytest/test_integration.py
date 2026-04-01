"""
Testes de Integração — CT22 a CT24
Cobre fluxos completos entre módulos.
"""
import uuid
import requests


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"  # gera e-mail único para evitar conflito entre testes


# CT22 — Fluxo completo de autenticação
def test_full_auth_flow(base_url):
    email = unique_email()
    password = "senha123"

    register = requests.post(f"{base_url}/auth/register", json={"email": email, "password": password})
    assert register.status_code == 201              # passo 1: registro deve funcionar

    login = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200                 # passo 2: login deve funcionar
    tokens = login.json()["data"]
    refresh_token = tokens["refreshToken"]

    refresh = requests.post(f"{base_url}/auth/refresh", json={"refreshToken": refresh_token})
    assert refresh.status_code == 200               # passo 3: refresh deve gerar novo access token
    assert "accessToken" in refresh.json()["data"]

    logout = requests.post(f"{base_url}/auth/logout", json={"refreshToken": refresh_token})
    assert logout.status_code == 200                # passo 4: logout deve revogar o token

    revoked = requests.post(f"{base_url}/auth/refresh", json={"refreshToken": refresh_token})
    assert revoked.status_code == 401               # passo 5: token revogado não deve mais funcionar


# CT23 — Fluxo completo de tarefas
def test_full_task_flow(base_url):
    email = unique_email()
    password = "senha123"

    requests.post(f"{base_url}/auth/register", json={"email": email, "password": password})
    login = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    token = login.json()["data"]["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}

    create = requests.post(f"{base_url}/tasks", json={"title": "Tarefa integração"}, headers=headers)
    assert create.status_code == 201                # passo 1: criar tarefa
    task_id = create.json()["data"]["id"]

    list_tasks = requests.get(f"{base_url}/tasks", headers=headers)
    assert list_tasks.status_code == 200
    ids = [t["id"] for t in list_tasks.json()["data"]]
    assert task_id in ids                           # passo 2: tarefa deve aparecer na listagem

    update = requests.put(f"{base_url}/tasks/{task_id}", json={"title": "Tarefa editada"}, headers=headers)
    assert update.status_code == 200
    assert update.json()["data"]["title"] == "Tarefa editada"  # passo 3: edição deve persistir

    toggle = requests.patch(f"{base_url}/tasks/{task_id}/toggle", headers=headers)
    assert toggle.status_code == 200
    assert toggle.json()["data"]["completed"] is True  # passo 4: toggle deve marcar como concluída

    delete = requests.delete(f"{base_url}/tasks/{task_id}", headers=headers)
    assert delete.status_code == 204                # passo 5: exclusão deve funcionar

    list_after = requests.get(f"{base_url}/tasks", headers=headers)
    ids_after = [t["id"] for t in list_after.json()["data"]]
    assert task_id not in ids_after                 # passo 6: tarefa não deve mais existir


# CT24 — Isolamento de dados entre usuários (RN02)
def test_data_isolation_between_users(base_url):
    email_a = unique_email()
    requests.post(f"{base_url}/auth/register", json={"email": email_a, "password": "senha123"})
    login_a = requests.post(f"{base_url}/auth/login", json={"email": email_a, "password": "senha123"})
    headers_a = {"Authorization": f"Bearer {login_a.json()['data']['accessToken']}"}  # token do usuário A

    email_b = unique_email()
    requests.post(f"{base_url}/auth/register", json={"email": email_b, "password": "senha123"})
    login_b = requests.post(f"{base_url}/auth/login", json={"email": email_b, "password": "senha123"})
    headers_b = {"Authorization": f"Bearer {login_b.json()['data']['accessToken']}"}  # token do usuário B

    create = requests.post(f"{base_url}/tasks", json={"title": "Tarefa do usuário A"}, headers=headers_a)
    task_id = create.json()["data"]["id"]           # tarefa criada pelo usuário A

    list_b = requests.get(f"{base_url}/tasks", headers=headers_b)
    ids_b = [t["id"] for t in list_b.json()["data"]]
    assert task_id not in ids_b                     # usuário B não deve ver a tarefa de A

    update = requests.put(f"{base_url}/tasks/{task_id}", json={"title": "Invasão"}, headers=headers_b)
    assert update.status_code == 404                # usuário B não deve conseguir editar tarefa de A

    delete = requests.delete(f"{base_url}/tasks/{task_id}", headers=headers_b)
    assert delete.status_code == 404                # usuário B não deve conseguir excluir tarefa de A

    list_a = requests.get(f"{base_url}/tasks", headers=headers_a)
    ids_a = [t["id"] for t in list_a.json()["data"]]
    assert task_id in ids_a                         # usuário A ainda deve ter acesso à sua própria tarefa
