"""
Testes de Autenticação — CT01 a CT11
Cobre: Unidade, Aceitação, Regressão
"""
import uuid
import requests


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"


# CT01 — Registro com dados válidos
def test_register_valid(base_url):
    response = requests.post(f"{base_url}/auth/register", json={
        "email": unique_email(),
        "password": "senha123",
    })
    assert response.status_code == 201
    data = response.json()
    assert "data" in data
    assert "user" in data["data"]
    assert "id" in data["data"]["user"]
    assert "email" in data["data"]["user"]
    assert "password" not in data["data"]["user"]


# CT02 — Registro com e-mail duplicado
def test_register_duplicate_email(base_url):
    email = unique_email()
    requests.post(f"{base_url}/auth/register", json={"email": email, "password": "senha123"})

    response = requests.post(f"{base_url}/auth/register", json={"email": email, "password": "senha123"})
    assert response.status_code == 409
    assert "message" in response.json()


# CT03 — Registro com e-mail inválido
def test_register_invalid_email(base_url):
    response = requests.post(f"{base_url}/auth/register", json={
        "email": "nao-e-um-email",
        "password": "senha123",
    })
    assert response.status_code == 400


# CT04 — Registro com senha curta
def test_register_short_password(base_url):
    response = requests.post(f"{base_url}/auth/register", json={
        "email": unique_email(),
        "password": "123",
    })
    assert response.status_code == 400


# CT05 — Login com credenciais válidas
def test_login_valid(base_url, registered_user):
    response = requests.post(f"{base_url}/auth/login", json=registered_user)
    assert response.status_code == 200
    data = response.json()["data"]
    assert "accessToken" in data
    assert "refreshToken" in data
    assert "user" in data
    assert "password" not in data["user"]


# CT06 — Login com senha incorreta
def test_login_wrong_password(base_url, registered_user):
    response = requests.post(f"{base_url}/auth/login", json={
        "email": registered_user["email"],
        "password": "senha_errada",
    })
    assert response.status_code == 401
    assert "message" in response.json()


# CT07 — Login com e-mail inexistente
def test_login_unknown_email(base_url):
    response = requests.post(f"{base_url}/auth/login", json={
        "email": "naoexiste@example.com",
        "password": "senha123",
    })
    assert response.status_code == 401
    assert "message" in response.json()


# CT08 — Logout com token válido
def test_logout_valid(base_url, auth_tokens):
    response = requests.post(f"{base_url}/auth/logout", json={
        "refreshToken": auth_tokens["refreshToken"],
    })
    assert response.status_code == 200
    assert "message" in response.json()


# CT09 — Logout com token inválido
def test_logout_invalid_token(base_url):
    response = requests.post(f"{base_url}/auth/logout", json={
        "refreshToken": "token_invalido_qualquer",
    })
    assert response.status_code == 401


# CT10 — Refresh com token válido
def test_refresh_valid(base_url, auth_tokens):
    response = requests.post(f"{base_url}/auth/refresh", json={
        "refreshToken": auth_tokens["refreshToken"],
    })
    assert response.status_code == 200
    data = response.json()["data"]
    assert "accessToken" in data


# CT11 — Refresh com token revogado (regressão)
def test_refresh_revoked_token(base_url, auth_tokens):
    refresh_token = auth_tokens["refreshToken"]

    requests.post(f"{base_url}/auth/logout", json={"refreshToken": refresh_token})

    response = requests.post(f"{base_url}/auth/refresh", json={"refreshToken": refresh_token})
    assert response.status_code == 401
