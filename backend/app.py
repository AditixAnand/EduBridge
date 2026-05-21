import os

from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from openai import OpenAI

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# -----------------------------------------------------------------------------
# CORS configuration
# -----------------------------------------------------------------------------
# The frontend (index.html, ai.html, etc.) is typically served from a different
# origin than this Flask backend during development:
#   - VS Code Live Server: http://127.0.0.1:5500 (or http://localhost:5500)
#   - opened directly from disk: origin is "null"
#   - Flask backend itself:  http://127.0.0.1:5000
#
# Allowed origins can be overridden via the CORS_ALLOWED_ORIGINS env var as a
# comma-separated list, e.g.
#   CORS_ALLOWED_ORIGINS="https://edubridge.example.com,https://staging.example.com"
#
# Scope is limited to /chat and /health (the only endpoints the frontend hits)
# and to the methods we actually use, so we don't widen access unnecessarily.
# -----------------------------------------------------------------------------
_DEFAULT_ORIGINS = [
    "http://localhost:5500",
    "http://127.0.0.1:5500",
    "http://localhost:5000",
    "http://127.0.0.1:5000",
    "null",  # index.html opened directly via file:// during development
]
_env_origins = os.getenv("CORS_ALLOWED_ORIGINS", "").strip()
allowed_origins = (
    [o.strip() for o in _env_origins.split(",") if o.strip()]
    if _env_origins
    else _DEFAULT_ORIGINS
)

CORS(
    app,
    resources={
        r"/chat": {"origins": allowed_origins},
        r"/health": {"origins": allowed_origins},
    },
    methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type"],
    max_age=86400,  # cache preflight for 1 day
)

# -----------------------------------------------------------------------------
# OpenAI client
# -----------------------------------------------------------------------------
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key) if api_key else None


@app.route("/health", methods=["GET"])
def health():
    """Lightweight liveness check. Does not call OpenAI, safe to ping freely."""
    return jsonify({"status": "ok"}), 200


@app.route("/chat", methods=["POST"])
def chat():
    # Security check: ensure API key is loaded
    if not api_key or client is None:
        return jsonify({"error": "OpenAI API key is missing. Check your .env file."}), 500

    # Get the message from the frontend
    data = request.get_json(silent=True) or {}
    user_message = data.get("message")

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": "You are a helpful assistant for EduBridge, an online learning platform.",
                },
                {"role": "user", "content": user_message},
            ],
            max_tokens=150,
            temperature=0.7,
        )

        ai_response = response.choices[0].message.content.strip()
        return jsonify({"response": ai_response})

    except Exception as e:
        app.logger.exception("OpenAI call failed")
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)