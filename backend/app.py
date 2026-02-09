import os
from flask import Flask, request, jsonify
from openai import OpenAI
from dotenv import load_dotenv

# Load environment variables from the .env file
load_dotenv()

app = Flask(__name__)

# Initialize the OpenAI client
# It will automatically look for "OPENAI_API_KEY" in your environment variables
api_key = os.getenv("OPENAI_API_KEY")
client = OpenAI(api_key=api_key)

@app.route('/chat', methods=['POST'])
def chat():
    # Security check: Ensure API key is loaded
    if not api_key:
        return jsonify({"error": "OpenAI API key is missing. Check your .env file."}), 500

    # Get the message from the frontend
    data = request.get_json()
    user_message = data.get('message')
    
    if not user_message:
        return jsonify({"error": "No message provided"}), 400

    try:
        # Use the new Chat Completions API (v1.x syntax)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # Replaced deprecated "text-davinci-003"
            messages=[
                {"role": "system", "content": "You are a helpful assistant for EduBridge, an online learning platform."},
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,
            temperature=0.7
        )
        
        # New response structure for v1.x
        ai_response = response.choices[0].message.content.strip()
        return jsonify({"response": ai_response})

    except Exception as e:
        print(f"Error: {e}")  # Print to console for debugging
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)