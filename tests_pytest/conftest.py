import pytest
import requests

BASE_URL = "http://localhost:3001/api"


@pytest.fixture
def base_url():
    return BASE_URL


@pytest.fixture
def registered_user(base_url):
    """Cria um usuário único para o teste e retorna suas credenciais."""
    import uuid
    email = f"test_{uuid.uuid4().hex[:8]}@example.com"
    password = "senha123"

    requests.post(f"{base_url}/auth/register", json={"email": email, "password": password})

    return {"email": email, "password": password}


@pytest.fixture
def auth_tokens(base_url, registered_user):
    """Faz login e retorna os tokens de acesso."""
    response = requests.post(f"{base_url}/auth/login", json=registered_user)
    data = response.json()["data"]
    return {
        "accessToken": data["accessToken"],
        "refreshToken": data["refreshToken"],
        "user": data["user"],
    }


@pytest.fixture
def auth_headers(auth_tokens):
    """Retorna o header Authorization pronto para uso."""
    return {"Authorization": f"Bearer {auth_tokens['accessToken']}"}


@pytest.fixture
def created_task(base_url, auth_headers):
    """Cria uma tarefa e retorna seus dados."""
    response = requests.post(
        f"{base_url}/tasks",
        json={"title": "Tarefa de teste", "description": "Descrição de teste"},
        headers=auth_headers,
    )
    return response.json()["data"]
