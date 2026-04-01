"""
Testes de Tarefas — CT12 a CT21
Cobre: Unidade, Aceitação
"""
import uuid
import requests


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"  # gera e-mail único para evitar conflito entre testes


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
    assert response.status_code == 200              # deve retornar 200 OK
    assert "data" in response.json()                # resposta deve ter chave "data"
    assert isinstance(response.json()["data"], list)  # deve retornar uma lista


# CT13 — Listar tarefas sem autenticação
def test_list_tasks_unauthenticated(base_url):
    response = requests.get(f"{base_url}/tasks")    # sem header Authorization
    assert response.status_code == 401              # deve bloquear com 401 (RN04)


# CT14 — Criar tarefa com título válido
def test_create_task_valid(base_url, auth_headers):
    response = requests.post(f"{base_url}/tasks", json={
        "title": "Minha tarefa",
        "description": "Descrição opcional",
    }, headers=auth_headers)
    assert response.status_code == 201                              # deve retornar 201 Created
    data = response.json()["data"]
    assert data["title"] == "Minha tarefa"                          # título deve ser salvo corretamente
    assert data["description"] == "Descrição opcional"              # descrição deve ser salva
    assert data["completed"] is False                               # tarefa começa como não concluída


# CT15 — Criar tarefa sem título
def test_create_task_empty_title(base_url, auth_headers):
    response = requests.post(f"{base_url}/tasks", json={
        "title": "",                                # título vazio — viola RN03
    }, headers=auth_headers)
    assert response.status_code == 400              # deve rejeitar com 400 Bad Request


# CT16 — Criar tarefa sem autenticação
def test_create_task_unauthenticated(base_url):
    response = requests.post(f"{base_url}/tasks", json={"title": "Tarefa"})  # sem token
    assert response.status_code == 401              # deve bloquear com 401 (RN04)


# CT17 — Editar tarefa própria
def test_update_own_task(base_url, auth_headers, created_task):
    response = requests.put(
        f"{base_url}/tasks/{created_task['id']}",
        json={"title": "Título atualizado"},
        headers=auth_headers,                       # token do dono da tarefa
    )
    assert response.status_code == 200                                      # deve retornar 200 OK
    assert response.json()["data"]["title"] == "Título atualizado"          # título deve ser atualizado


# CT18 — Editar tarefa de outro usuário (RN02)
def test_update_other_user_task(base_url, auth_headers, created_task):
    other_headers = create_user_and_login(base_url)  # cria um segundo usuário diferente

    response = requests.put(
        f"{base_url}/tasks/{created_task['id']}",
        json={"title": "Tentativa de invasão"},
        headers=other_headers,                      # token de outro usuário
    )
    assert response.status_code == 404              # deve retornar 404 — tarefa não pertence a ele (RN02)


# CT19 — Toggle status de tarefa
def test_toggle_task_status(base_url, auth_headers, created_task):
    task_id = created_task["id"]
    original_status = created_task["completed"]     # status inicial (False)

    response = requests.patch(f"{base_url}/tasks/{task_id}/toggle", headers=auth_headers)
    assert response.status_code == 200                                          # deve retornar 200 OK
    assert response.json()["data"]["completed"] != original_status              # status deve ter invertido

    response2 = requests.patch(f"{base_url}/tasks/{task_id}/toggle", headers=auth_headers)
    assert response2.status_code == 200                                         # segundo toggle também deve funcionar
    assert response2.json()["data"]["completed"] == original_status             # deve voltar ao status original


# CT20 — Excluir tarefa própria
def test_delete_own_task(base_url, auth_headers, created_task):
    task_id = created_task["id"]

    response = requests.delete(f"{base_url}/tasks/{task_id}", headers=auth_headers)
    assert response.status_code == 204              # deve retornar 204 No Content

    list_response = requests.get(f"{base_url}/tasks", headers=auth_headers)
    ids = [t["id"] for t in list_response.json()["data"]]
    assert task_id not in ids                       # tarefa não deve mais aparecer na listagem


# CT21 — Excluir tarefa de outro usuário (RN02)
def test_delete_other_user_task(base_url, auth_headers, created_task):
    other_headers = create_user_and_login(base_url)  # cria um segundo usuário diferente

    response = requests.delete(
        f"{base_url}/tasks/{created_task['id']}",
        headers=other_headers,                      # token de outro usuário
    )
    assert response.status_code == 404              # deve retornar 404 — tarefa não pertence a ele (RN02)
