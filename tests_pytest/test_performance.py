"""
Testes de Desempenho — CT25 a CT27
Verifica tempo de resposta dos endpoints críticos.
"""
import time
import requests


# CT25 — Tempo de resposta do login
def test_login_response_time(base_url, registered_user):
    start = time.time()
    response = requests.post(f"{base_url}/auth/login", json=registered_user)
    elapsed = time.time() - start

    assert response.status_code == 200
    assert elapsed < 2.0, f"Login demorou {elapsed:.2f}s (limite: 2s)"


# CT26 — Tempo de resposta ao listar tarefas
def test_list_tasks_response_time(base_url, auth_headers):
    start = time.time()
    response = requests.get(f"{base_url}/tasks", headers=auth_headers)
    elapsed = time.time() - start

    assert response.status_code == 200
    assert elapsed < 1.0, f"Listagem demorou {elapsed:.2f}s (limite: 1s)"


# CT27 — Tempo de resposta ao criar tarefa
def test_create_task_response_time(base_url, auth_headers):
    start = time.time()
    response = requests.post(f"{base_url}/tasks", json={"title": "Tarefa de performance"}, headers=auth_headers)
    elapsed = time.time() - start

    assert response.status_code == 201
    assert elapsed < 1.0, f"Criação demorou {elapsed:.2f}s (limite: 1s)"
