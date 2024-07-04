from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from gtts import gTTS
from io import BytesIO
import base64
import textwrap
from langchain_community.llms import Ollama  # Import Ollama from langchain_community.llms

app = Flask(__name__)
CORS(app)

ollama = Ollama(model="llama3")  # Initialize Ollama model

DEFAULT_SYSTEM_PROMPT = """\
You are a friendly AI friend designed to have engaging and supportive conversations with users. 
Your primary goal is to be helpful, empathetic, and entertaining. You should:\n\n
1. **Be Friendly and Engaging:** Start conversations with greetings, ask questions, and maintain a warm, conversational tone. 
Respond to user inputs with kindness and enthusiasm.\n\n
2. **Share Information:** Provide accurate and interesting information on a wide range of topics. Feel free to share facts, stories, and explanations. 
If the user asks for something specific, give detailed and helpful answers.\n\n
3. **Offer Emotional Support:** Be empathetic and understanding. Respond with supportive and comforting words when users express feelings of stress, sadness, or any emotional concerns.\n\n
4. **Maintain Conversational Continuity:** Remember previous parts of the conversation to keep the dialogue coherent. Refer back to past topics to maintain context and make the conversation flow naturally.\n\n
5. **Personalize Interactions:** Adapt your responses based on the user’s interests, preferences, and previous interactions. Show genuine interest in the user’s hobbies, likes, and dislikes.\n\n
6. **Be Entertaining:** Include jokes, stories, fun facts, or games to keep the conversation lively and enjoyable. Respond to requests for entertainment with creativity and humor.\n\n
Always aim to make the user feel heard, understood, and entertained. Your responses should be safe, respectful, and inclusive. If you are unsure how to respond, default to being polite and encouraging.\n\n
User: <User input>\nAI:"""

def get_prompt(instruction, new_system_prompt=DEFAULT_SYSTEM_PROMPT, citation=None):
    SYSTEM_PROMPT = new_system_prompt
    prompt_template = SYSTEM_PROMPT + instruction

    if citation:
        prompt_template += f"\n\nCitation: {citation}"

    return prompt_template

def generate(text, citation=None):
    prompt = get_prompt(text, citation=citation)
    response = ollama.generate(prompt)  # Generate response using Ollama model
    return response

def text_to_speech(text):
    if text:
        tts = gTTS(text=text, slow=False)
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return audio_buffer.read()
    else:
        return b''  # Return an empty bytes object if no text is provided

def parse_text(text):
    wrapped_text = textwrap.fill(text, width=100)
    return wrapped_text

@app.route('/')
def index():
    return ('welcome to Ai friend')

@app.route('/speech_to_text', methods=['POST'])
def speech_to_text():
    data = request.json
    text = data.get('text', '')
    if text:
        response = generate(text)
        audio = text_to_speech(response)
        if audio:
            audio_base64 = base64.b64encode(audio).decode('utf-8')
        else:
            audio_base64 = ''
        return jsonify({
            "correct_answer": response,
            "audio_base64": audio_base64
        })
    else:
        return jsonify({"error": "No 'text' field provided in the request."}), 400

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
