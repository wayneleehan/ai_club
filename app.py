import os
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai

# Load environment variables
load_dotenv()

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

# Configure Gemini API
# This assumes GEMINI_API_KEY is set in the .env file or system environment
api_key = os.getenv("GEMINI_API_KEY")
if api_key:
    genai.configure(api_key=api_key)
    # Use gemini-2.5-flash as the default fast model
    model = genai.GenerativeModel('gemini-2.5-flash', system_instruction="You are an AI assistant for Wayne's portfolio website. You should be helpful, professional, and friendly. You know that Wayne is a Software Engineer and Data Enthusiast who studied MIS at National Chengchi University.")
else:
    model = None
    print("WARNING: GEMINI_API_KEY not found in environment. Chat API will return errors.")

@app.route('/')
def serve_index():
    return send_from_directory('.', 'index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    if not model:
        return jsonify({"error": "Gemini API key is not configured on the server."}), 500

    data = request.json
    if not data or 'message' not in data:
        return jsonify({"error": "Missing 'message' in request body."}), 400

    user_message = data['message']

    try:
        # Generate response using Gemini
        response = model.generate_content(user_message)
        return jsonify({"response": response.text})
    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return jsonify({"error": "Failed to generate response from AI."}), 500

if __name__ == '__main__':
    # Run the app on port 5001
    app.run(host='0.0.0.0', port=5001, debug=True)
