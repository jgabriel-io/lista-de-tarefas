"""
Placeholder para validar o ambiente de testes.
Rode com: pytest tests_pytest/
"""
import requests


def test_environment_is_ready():
    """Verifica que o módulo requests está disponível."""
    assert requests is not None


def test_health_check(base_url):
    """Verifica que o backend está rodando e respondendo."""
    try:
        response = requests.get(f"{base_url.replace('/api', '')}/health", timeout=3)
        assert response.status_code == 200
        assert response.json()["status"] == "ok"
    except requests.exceptions.ConnectionError:
        import pytest
        pytest.skip("Backend não está rodando. Suba o servidor antes de executar este teste.")
