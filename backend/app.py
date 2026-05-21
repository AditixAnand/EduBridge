import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
from dotenv import load_dotenv

# 1. Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# 2. Enable CORS (Cross-Origin Resource Sharing)
# This allows your frontend (running on a different port/Live Server) to talk to this backend
CORS(app)

# Lazy singleton for OpenAI client to avoid per-request allocations but still
# allow the server to start when the API key is not yet configured.
_openai_client = None

def get_openai_client():
    global _openai_client
    if _openai_client is not None:
        return _openai_client

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return None

    _openai_client = OpenAI(api_key=api_key)
    return _openai_client

@app.route('/chat', methods=['POST'])
def chat():
    # Obtain a client (lazy). If missing, return a generic service-unavailable error.
    client = get_openai_client()
    if client is None:
        # Log a helpful message server-side (do not expose file paths to clients)
        print("OpenAI API key is not configured. Set OPENAI_API_KEY in backend/.env or environment to enable AI features.")
        return jsonify({"error": "AI service not configured"}), 503

    # Get the message from the frontend
    data = request.get_json()
    user_message = data.get('message')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # 4. Use the new Chat Completions API (v1.x syntax)
        # Using gpt-3.5-turbo (faster & cheaper than davinci)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant for EduBridge, an online learning platform."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        # 5. Access the response using the new v1.x object structure
        ai_response = response.choices[0].message.content.strip()
        return jsonify({"response": ai_response})

    except Exception as e:
        print(f"Error: {e}")  # Print to console for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)