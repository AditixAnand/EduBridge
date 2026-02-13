import os  # Used to access environment variables (like API keys) from the operating system
from flask import Flask, request, jsonify  # Import Flask to create the web app, request to handle incoming data, and jsonify to send JSON responses
from flask_cors import CORS  # Import CORS to allow the frontend (HTML/JS) to communicate with this backend
from openai import OpenAI  # Import the OpenAI client to interact with the AI model
from dotenv import load_dotenv  # Import load_dotenv to read variables from the .env file

# ---------------------------------------------------------------------------
# 1. Load Environment Variables
# ---------------------------------------------------------------------------
# This function loads the variables defined in the .env file into the system's environment.
# It helps keep sensitive information (like your API key) secure and out of the code.
load_dotenv()

# ---------------------------------------------------------------------------
# 2. Initialize the Flask Application
# ---------------------------------------------------------------------------
app = Flask(__name__)  # Create a new Flask web application instance

# ---------------------------------------------------------------------------
# 3. Enable CORS (Cross-Origin Resource Sharing)
# ---------------------------------------------------------------------------
# Browsers block requests from one domain (e.g., your local file or frontend server) to another (your backend) by default for security.
# CORS(app) tells the browser it's okay for your frontend to talk to this backend.
CORS(app)

# ---------------------------------------------------------------------------
# 4. Initialize the OpenAI Client
# ---------------------------------------------------------------------------
# Get the API key securely from the environment variables loaded earlier.
api_key = os.getenv("OPENAI_API_KEY")

# Create the OpenAI client instance using the retrieved API key.
# This client handles all communication with OpenAI's servers.
client = OpenAI(api_key=api_key)

# ---------------------------------------------------------------------------
# 5. Define the Chat Route
# ---------------------------------------------------------------------------
# This decorator tells Flask that any POST request sent to the URL '/chat' should be handled by the 'chat' function below.
@app.route('/chat', methods=['POST'])
def chat():
    # Security Check: Verify that the API Key was successfully loaded.
    if not api_key:
        return jsonify({"error": "OpenAI API key is missing. Please check your .env file."}), 500

    # Data Retrieval: Get the JSON data sent by the frontend (users message).
    try:
        data = request.get_json()
        user_message = data.get('message')
    except Exception:
        return jsonify({"error": "Invalid data format. Expected JSON."}), 400
    
    # Validation: Ensure the user actually sent a message.
    if not user_message:
        return jsonify({"error": "No message provided."}), 400

    try:
        # AI Interaction: Send the user's message to OpenAI's Chat Completions API.
        # We use the 'gpt-3.5-turbo' model which is fast and cost-effective.
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                # System message: Instructions for how the AI should behave.
                {"role": "system", "content": "You are a helpful assistant for EduBridge, an online learning platform."},
                # User message: The actual input from the person using the chat.
                {"role": "user", "content": user_message}
            ],
            max_tokens=150,  # Limit the response length to save costs.
            temperature=0.7  # Controls randomness: 0.7 is a good balance between creative and focused.
        )
        
        # Response Handling: Extract the actual text content from the AI's response object.
        # The structure is response -> choices[0] -> message -> content.
        ai_response = response.choices[0].message.content.strip()
        
        # Return the AI's response as a JSON object to the frontend.
        return jsonify({"response": ai_response})

    except Exception as e:
        # Error Handling: If something goes wrong (e.g., API error, network issue), print it for debugging.
        print(f"Error occurred: {e}")
        # Return a 500 Internal Server Error to the frontend.
        return jsonify({"error": str(e)}), 500

# ---------------------------------------------------------------------------
# 6. Run the Application
# ---------------------------------------------------------------------------
# This block ensures the app only runs if this script is executed directly (not imported as a module).
if __name__ == "__main__":
    # Start the Flask development server.
    # debug=True enables auto-reload on code changes and provides detailed error messages.
    app.run(debug=True)
