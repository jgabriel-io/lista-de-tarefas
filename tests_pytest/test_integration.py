"""
Testes de Integração — CT22 a CT24
Cobre fluxos completos entre módulos.
"""
import uuid
import requests


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"


# CT22 — Fluxo completo de autenticação
def test_full_auth_flow(base_url):
    email = unique_email()
    password = "senha123"

    # Register
    register = requests.post(f"{base_url}/auth/register", json={"email": email, "password": password})
    assert register.status_code == 201

    # Login
    login = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    assert login.status_code == 200
    tokens = login.json()["data"]
    refresh_token = tokens["refreshToken"]
    access_token = tokens["accessToken"]

    # Refresh
    refresh = requests.post(f"{base_url}/auth/refresh", json={"refreshToken": refresh_token})
    assert refresh.status_code == 200
    assert "accessToken" in refresh.json()["data"]

    # Logout
    logout = requests.post(f"{base_url}/auth/logout", json={"refreshToken": refresh_token})
    assert logout.status_code == 200

    # Token revogado após logout
    revoked = requests.post(f"{base_url}/auth/refresh", json={"refreshToken": refresh_token})
    assert revoked.status_code == 401


# CT23 — Fluxo completo de tarefas
def test_full_task_flow(base_url):
    email = unique_email()
    password = "senha123"

    requests.post(f"{base_url}/auth/register", json={"email": email, "password": password})
    login = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    token = login.json()["data"]["accessToken"]
    headers = {"Authorization": f"Bearer {token}"}

    # Criar tarefa
    create = requests.post(f"{base_url}/tasks", json={"title": "Tarefa integração"}, headers=headers)
    assert create.status_code == 201
    task_id = create.json()["data"]["id"]

    # Listar — deve conter a tarefa criada
    list_tasks = requests.get(f"{base_url}/tasks", headers=headers)
    assert list_tasks.status_code == 200
    ids = [t["id"] for t in list_tasks.json()["data"]]
    assert task_id in ids

    # Editar
    update = requests.put(f"{base_url}/tasks/{task_id}", json={"title": "Tarefa editada"}, headers=headers)
    assert update.status_code == 200
    assert update.json()["data"]["title"] == "Tarefa editada"

    # Toggle
    toggle = requests.patch(f"{base_url}/tasks/{task_id}/toggle", headers=headers)
    assert toggle.status_code == 200
    assert toggle.json()["data"]["completed"] is True

    # Excluir
    delete = requests.delete(f"{base_url}/tasks/{task_id}", headers=headers)
    assert delete.status_code == 204

    # Listar — não deve mais conter a tarefa
    list_after = requests.get(f"{base_url}/tasks", headers=headers)
    ids_after = [t["id"] for t in list_after.json()["data"]]
    assert task_id not in ids_after


# CT24 — Isolamento de dados entre usuários (RN02)
def test_data_isolation_between_users(base_url):
    # Usuário A
    email_a = unique_email()
    requests.post(f"{base_url}/auth/register", json={"email": email_a, "password": "senha123"})
    login_a = requests.post(f"{base_url}/auth/login", json={"email": email_a, "password": "senha123"})
    headers_a = {"Authorization": f"Bearer {login_a.json()['data']['accessToken']}"}

    # Usuário B
    email_b = unique_email()
    requests.post(f"{base_url}/auth/register", json={"email": email_b, "password": "senha123"})
    login_b = requests.post(f"{base_url}/auth/login", json={"email": email_b, "password": "senha123"})
    headers_b = {"Authorization": f"Bearer {login_b.json()['data']['accessToken']}"}

    # Usuário A cria tarefa
    create = requests.post(f"{base_url}/tasks", json={"title": "Tarefa do usuário A"}, headers=headers_a)
    task_id = create.json()["data"]["id"]

    # Usuário B não deve ver a tarefa de A
    list_b = requests.get(f"{base_url}/tasks", headers=headers_b)
    ids_b = [t["id"] for t in list_b.json()["data"]]
    assert task_id not in ids_b

    # Usuário B não deve editar a tarefa de A
    update = requests.put(f"{base_url}/tasks/{task_id}", json={"title": "Invasão"}, headers=headers_b)
    assert update.status_code == 404

    # Usuário B não deve excluir a tarefa de A
    delete = requests.delete(f"{base_url}/tasks/{task_id}", headers=headers_b)
    assert delete.status_code == 404

    # Usuário A ainda consegue acessar sua tarefa normalmente
    list_a = requests.get(f"{base_url}/tasks", headers=headers_a)
    ids_a = [t["id"] for t in list_a.json()["data"]]
    assert task_id in ids_a
