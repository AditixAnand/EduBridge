import os
from flask import Flask, request, jsonify
from flask_cors import CORS
# from openai import OpenAI
from google import genai
from dotenv import load_dotenv

# 1. Load environment variables from .env file
load_dotenv()

app = Flask(__name__)

# 2. Enable CORS (Cross-Origin Resource Sharing)
# This allows your frontend (running on a different port/Live Server) to talk to this backend
CORS(app)

# 3. Initialize the OpenAI client securely
# It automatically looks for "OPENAI_API_KEY" in your environment variables
api_key = os.getenv("OPENAI_API_KEY")
# client = OpenAI(api_key=api_key)
client=genai.Client(api_key=api_key)

@app.route('/')
def home():
    return jsonify({"response": "Successful"})

@app.route('/chat', methods=['POST'])
def chat():
    print("Chat route hit")
    # Security check: Ensure API key is loaded
    if not api_key:
        return jsonify({"error": "OpenAI API key is missing. Check your .env file."}), 500

    # Get the message from the frontend
    data = request.get_json()
    user_message = data.get('message')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # 4. Use the new Chat Completions API (v1.x syntax)
        # Using gpt-3.5-turbo (faster & cheaper than davinci)
        response = client.models.generate_content(
            model="gemini-3-flash-preview",
            contents=f"""
        You are a helpful assistant for EduBridge, an online learning platform.

        User Question:
        {user_message}
        """
            # max_tokens=150,
            # temperature=0.7
        )
        
        # 5. Access the response using the new v1.x object structure
        ai_response = response.text
        return jsonify({"response": ai_response})

    except Exception as e:
        print(f"Error: {e}")  # Print to console for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)