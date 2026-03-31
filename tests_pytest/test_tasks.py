"""
Testes de Tarefas — CT12 a CT21
Cobre: Unidade, Aceitação
"""
import uuid
import requests


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"


def create_user_and_login(base_url):
    """Helper: cria usuário e retorna headers de autenticação."""
    email = unique_email()
    password = "senha123"
    requests.post(f"{base_url}/auth/register", json={"email": email, "password": password})
    response = requests.post(f"{base_url}/auth/login", json={"email": email, "password": password})
    token = response.json()["data"]["accessToken"]
    return {"Authorization": f"Bearer {token}"}


# CT12 — Listar tarefas autenticado
def test_list_tasks_authenticated(base_url, auth_headers):
    response = requests.get(f"{base_url}/tasks", headers=auth_headers)
    assert response.status_code == 200
    assert "data" in response.json()
    assert isinstance(response.json()["data"], list)


# CT13 — Listar tarefas sem autenticação
def test_list_tasks_unauthenticated(base_url):
    response = requests.get(f"{base_url}/tasks")
    assert response.status_code == 401


# CT14 — Criar tarefa com título válido
def test_create_task_valid(base_url, auth_headers):
    response = requests.post(f"{base_url}/tasks", json={
        "title": "Minha tarefa",
        "description": "Descrição opcional",
    }, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()["data"]
    assert data["title"] == "Minha tarefa"
    assert data["description"] == "Descrição opcional"
    assert data["completed"] is False


# CT15 — Criar tarefa sem título
def test_create_task_empty_title(base_url, auth_headers):
    response = requests.post(f"{base_url}/tasks", json={
        "title": "",
    }, headers=auth_headers)
    assert response.status_code == 400


# CT16 — Criar tarefa sem autenticação
def test_create_task_unauthenticated(base_url):
    response = requests.post(f"{base_url}/tasks", json={"title": "Tarefa"})
    assert response.status_code == 401


# CT17 — Editar tarefa própria
def test_update_own_task(base_url, auth_headers, created_task):
    response = requests.put(
        f"{base_url}/tasks/{created_task['id']}",
        json={"title": "Título atualizado"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["data"]["title"] == "Título atualizado"


# CT18 — Editar tarefa de outro usuário (RN02)
def test_update_other_user_task(base_url, auth_headers, created_task):
    other_headers = create_user_and_login(base_url)

    response = requests.put(
        f"{base_url}/tasks/{created_task['id']}",
        json={"title": "Tentativa de invasão"},
        headers=other_headers,
    )
    assert response.status_code == 404


# CT19 — Toggle status de tarefa
def test_toggle_task_status(base_url, auth_headers, created_task):
    task_id = created_task["id"]
    original_status = created_task["completed"]

    response = requests.patch(f"{base_url}/tasks/{task_id}/toggle", headers=auth_headers)
    assert response.status_code == 200
    assert response.json()["data"]["completed"] != original_status

    response2 = requests.patch(f"{base_url}/tasks/{task_id}/toggle", headers=auth_headers)
    assert response2.status_code == 200
    assert response2.json()["data"]["completed"] == original_status


# CT20 — Excluir tarefa própria
def test_delete_own_task(base_url, auth_headers, created_task):
    task_id = created_task["id"]

    response = requests.delete(f"{base_url}/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 204

    list_response = requests.get(f"{base_url}/tasks", headers=auth_headers)
    ids = [t["id"] for t in list_response.json()["data"]]
    assert task_id not in ids


# CT21 — Excluir tarefa de outro usuário (RN02)
def test_delete_other_user_task(base_url, auth_headers, created_task):
    other_headers = create_user_and_login(base_url)

    response = requests.delete(
        f"{base_url}/tasks/{created_task['id']}",
        headers=other_headers,
    )
    assert response.status_code == 404
