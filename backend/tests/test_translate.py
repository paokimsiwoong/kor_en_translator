import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_translate():
    async with AsyncClient(app=app, base_url="http://0.0.0.0:8000") as client:
        response = await client.post(
            "/api/v1/translate/",
            json={"text": "안녕하세요", "max_length": 50}
        )
        assert response.status_code == 200
        data = response.json()
        assert "translation" in data

    print(data)
