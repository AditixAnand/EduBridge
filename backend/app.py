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


# 3. Initialize the OpenAI client securely
# It automatically looks for "OPENAI_API_KEY" in your environment variables
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

@app.route('/')
def home():
    return jsonify({"response": "Successful"})

@app.route('/chat', methods=['POST'])
def chat():
    print("Chat route hit")
    # Security check: Ensure API key is loaded
    if not api_key:
        return jsonify({"error": "OpenAI API key is missing. Check your .env file."}), 500

    data = request.get_json()
    user_message = data.get('message')
    
    with open("/EduBridge/resources/info.txt","r") as file:
        context=file.read()

    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {
                    "role": "system",
                    "content": """
                        You are a helpful assistant for EduBridge, an online learning platform.
                        Answer the queries related to EduBridge using the context provided. Otherwise answer general questions accordingly.
                        Do not use Markdown formatting. Never use asterisks (*) for bold text or bullet points.
                        Use standard capital letters for headers, plain numbers for lists, and regular line breaks.
                        """
                },
                {
                    "role": "user",
                    "content": f"""
                        User Question:
                        {user_message}

                        Context:
                        {context}
                        """
                }
            ],
            max_tokens=150,
            temperature=0.7
        )

        ai_response = response.choices[0].message.content.strip()
        return jsonify({"response": ai_response})

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)