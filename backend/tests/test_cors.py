"""
Tests for CORS support on the Flask backend.

Verifies issue #11 acceptance criteria: the frontend (running on a different
origin) can successfully send POST requests to /chat.

Run from the repo root:
    pip install -r backend/requirements.txt
    pip install pytest
    pytest backend/tests -q
"""
import importlib
from unittest.mock import MagicMock, patch

import pytest


ALLOWED_ORIGIN = "http://127.0.0.1:5500"
DISALLOWED_ORIGIN = "http://evil.example.com"


@pytest.fixture
def client(monkeypatch):
    # Provide a fake API key so the app initializes its OpenAI client.
    monkeypatch.setenv("OPENAI_API_KEY", "test-key")
    monkeypatch.setenv(
        "CORS_ALLOWED_ORIGINS",
        f"{ALLOWED_ORIGIN},http://localhost:5500",
    )
    # Import after env vars are set so module-level config picks them up.
    import app as app_module  # noqa: WPS433  (path is set in conftest.py)
    importlib.reload(app_module)
    app_module.app.config["TESTING"] = True
    return app_module.app.test_client()


def test_health_endpoint_is_reachable(client):
    resp = client.get("/health")
    assert resp.status_code == 200
    assert resp.get_json() == {"status": "ok"}


def test_preflight_from_allowed_origin_succeeds(client):
    resp = client.options(
        "/chat",
        headers={
            "Origin": ALLOWED_ORIGIN,
            "Access-Control-Request-Method": "POST",
            "Access-Control-Request-Headers": "Content-Type",
        },
    )
    assert resp.status_code in (200, 204)
    assert resp.headers.get("Access-Control-Allow-Origin") == ALLOWED_ORIGIN
    allow_methods = resp.headers.get("Access-Control-Allow-Methods", "")
    assert "POST" in allow_methods


def test_post_chat_from_allowed_origin_has_cors_header(client):
    fake_completion = MagicMock()
    fake_completion.choices = [MagicMock(message=MagicMock(content="hi from openai"))]

    with patch("app.client") as mock_openai:
        mock_openai.chat.completions.create.return_value = fake_completion

        resp = client.post(
            "/chat",
            json={"message": "hello"},
            headers={"Origin": ALLOWED_ORIGIN},
        )

    assert resp.status_code == 200
    assert resp.get_json() == {"response": "hi from openai"}
    assert resp.headers.get("Access-Control-Allow-Origin") == ALLOWED_ORIGIN


def test_post_chat_from_disallowed_origin_lacks_cors_header(client):
    fake_completion = MagicMock()
    fake_completion.choices = [MagicMock(message=MagicMock(content="hi"))]

    with patch("app.client") as mock_openai:
        mock_openai.chat.completions.create.return_value = fake_completion

        resp = client.post(
            "/chat",
            json={"message": "hello"},
            headers={"Origin": DISALLOWED_ORIGIN},
        )

    # CORS is a browser-enforced policy on responses, not a server-side block.
    # The server still answers, but it must NOT advertise this origin as allowed,
    # so the browser will refuse to expose the response to the page.
    assert resp.headers.get("Access-Control-Allow-Origin") != DISALLOWED_ORIGIN


def test_post_chat_missing_message_returns_400(client):
    resp = client.post(
        "/chat",
        json={},
        headers={"Origin": ALLOWED_ORIGIN},
    )
    assert resp.status_code == 400
    assert "error" in resp.get_json()