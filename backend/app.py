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

@app.route('/insights', methods=['POST'])
def insights():
    # Security check: Ensure API key is loaded
    if not api_key:
        return jsonify({"error": "OpenAI API key is missing. Check your .env file."}), 500

    # Get the quiz history from the request body
    data = request.get_json()
    quiz_history = data.get('quizHistory', [])
    
    if not quiz_history:
        return jsonify({"error": "No quiz history provided"}), 400

    # Format the quiz performance summary for the AI prompt
    history_summary = ""
    for idx, quiz in enumerate(quiz_history, 1):
        history_summary += f"{idx}. Quiz: {quiz.get('courseTitle')}, Score: {quiz.get('score')}/{quiz.get('total')}, Time Taken: {quiz.get('timeTaken')} seconds\n"
        answers = quiz.get('answers', [])
        for ans in answers:
            history_summary += f"   - Question: \"{ans.get('question')}\" | Topic: {ans.get('topic')} | Selected: \"{ans.get('selected')}\" | Correct: {ans.get('isCorrect')}\n"
        history_summary += "\n"

    # Assemble the final prompt
    prompt = f"""
You are the EduBridge AI Learning Advisor. Analyze this student's quiz performance and provide personalized study insights:

{history_summary}

Please structure your response in clear markdown and include:
1. **Overall Progress Assessment**: Summarize their performance pattern, identifying strengths and general progress.
2. **Topic-wise Difficulty Analysis**: Detail which topics they seem to find easy (high accuracy) and which ones they struggle with. Explain *why* these areas might be challenging (e.g. explain that JavaScript syntax/logic builds on HTML layouts).
3. **Personalized Study Roadmap**: Provide actionable recommendations and steps on what they should study next, linking concepts together.

Keep the advice practical, supportive, and under 250 words.
"""

    try:
        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful learning advisor and coach for EduBridge, an online educational platform."},
                {"role": "user", "content": prompt}
            ],
            max_tokens=400,
            temperature=0.7
        )
        ai_response = response.choices[0].message.content.strip()
        return jsonify({"insights": ai_response})

    except Exception as e:
        print(f"Error generating insights: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)