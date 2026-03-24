import pytest

BASE_URL = "http://localhost:3001/api"

@pytest.fixture
def base_url():
    return BASE_URL
