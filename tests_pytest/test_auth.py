"""
Testes de Autenticação — CT01 a CT11
Cobre: Unidade, Aceitação, Regressão
"""
import uuid
import requests


def unique_email():
    return f"test_{uuid.uuid4().hex[:8]}@example.com"  # gera e-mail único para evitar conflito entre testes


# CT01 — Registro com dados válidos
def test_register_valid(base_url):
    response = requests.post(f"{base_url}/auth/register", json={
        "email": unique_email(),
        "password": "senha123",
    })
    assert response.status_code == 201                          # deve retornar 201 Created
    data = response.json()
    assert "data" in data                                       # resposta deve ter chave "data"
    assert "user" in data["data"]                               # deve retornar o usuário criado
    assert "id" in data["data"]["user"]                         # usuário deve ter id
    assert "email" in data["data"]["user"]                      # usuário deve ter email
    assert "password" not in data["data"]["user"]               # senha nunca deve ser exposta


# CT02 — Registro com e-mail duplicado
def test_register_duplicate_email(base_url):
    email = unique_email()
    requests.post(f"{base_url}/auth/register", json={"email": email, "password": "senha123"})  # primeiro registro

    response = requests.post(f"{base_url}/auth/register", json={"email": email, "password": "senha123"})  # segundo com mesmo e-mail
    assert response.status_code == 409                          # deve retornar 409 Conflict (RN01)
    assert "message" in response.json()                         # deve retornar mensagem de erro


# CT03 — Registro com e-mail inválido
def test_register_invalid_email(base_url):
    response = requests.post(f"{base_url}/auth/register", json={
        "email": "nao-e-um-email",                              # formato inválido de e-mail
        "password": "senha123",
    })
    assert response.status_code == 400                          # deve rejeitar com 400 Bad Request


# CT04 — Registro com senha curta
def test_register_short_password(base_url):
    response = requests.post(f"{base_url}/auth/register", json={
        "email": unique_email(),
        "password": "123",                                      # senha com menos de 6 caracteres
    })
    assert response.status_code == 400                          # deve rejeitar com 400 Bad Request


# CT05 — Login com credenciais válidas
def test_login_valid(base_url, registered_user):
    response = requests.post(f"{base_url}/auth/login", json=registered_user)
    assert response.status_code == 200                          # deve retornar 200 OK
    data = response.json()["data"]
    assert "accessToken" in data                                # deve retornar access token (15min)
    assert "refreshToken" in data                               # deve retornar refresh token (7 dias)
    assert "user" in data                                       # deve retornar dados do usuário
    assert "password" not in data["user"]                       # senha nunca deve ser exposta


# CT06 — Login com senha incorreta
def test_login_wrong_password(base_url, registered_user):
    response = requests.post(f"{base_url}/auth/login", json={
        "email": registered_user["email"],
        "password": "senha_errada",                             # senha diferente da cadastrada
    })
    assert response.status_code == 401                          # deve retornar 401 Unauthorized
    assert "message" in response.json()                         # deve retornar mensagem de erro


# CT07 — Login com e-mail inexistente
def test_login_unknown_email(base_url):
    response = requests.post(f"{base_url}/auth/login", json={
        "email": "naoexiste@example.com",                       # e-mail não cadastrado no sistema
        "password": "senha123",
    })
    assert response.status_code == 401                          # deve retornar 401 Unauthorized
    assert "message" in response.json()                         # deve retornar mensagem de erro


# CT08 — Logout com token válido
def test_logout_valid(base_url, auth_tokens):
    response = requests.post(f"{base_url}/auth/logout", json={
        "refreshToken": auth_tokens["refreshToken"],            # token válido obtido no login
    })
    assert response.status_code == 200                          # deve retornar 200 OK
    assert "message" in response.json()                         # deve confirmar o logout


# CT09 — Logout com token inválido
def test_logout_invalid_token(base_url):
    response = requests.post(f"{base_url}/auth/logout", json={
        "refreshToken": "token_invalido_qualquer",              # token que não existe no banco
    })
    assert response.status_code == 401                          # deve retornar 401 Unauthorized


# CT10 — Refresh com token válido
def test_refresh_valid(base_url, auth_tokens):
    response = requests.post(f"{base_url}/auth/refresh", json={
        "refreshToken": auth_tokens["refreshToken"],            # token válido e não revogado
    })
    assert response.status_code == 200                          # deve retornar 200 OK
    data = response.json()["data"]
    assert "accessToken" in data                                # deve retornar novo access token


# CT11 — Refresh com token revogado (regressão)
def test_refresh_revoked_token(base_url, auth_tokens):
    refresh_token = auth_tokens["refreshToken"]

    requests.post(f"{base_url}/auth/logout", json={"refreshToken": refresh_token})  # revoga o token via logout

    response = requests.post(f"{base_url}/auth/refresh", json={"refreshToken": refresh_token})  # tenta usar token revogado
    assert response.status_code == 401                          # deve rejeitar token já revogado
