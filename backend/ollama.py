

#! pip install langchain langchain-core langchain-community flask

# Commented out IPython magic to ensure Python compatibility.

# %load_ext colabxterm
# %xterm
#curl -fsSL https://ollama.com/install.sh | sh
#ollama serve & ollma run  llama3

#whatollama pull llama3

# from langchain_community.llms import ollama
# llm = ollama.Ollama(model="llama3")
# llm.invoke("what is profit&loss account?")

# ! pip install langchain_community

# pip install langchain

from flask import Flask, request, jsonify, render_template
from langchain_community.llms import ollama
from langchain.prompts import PromptTemplate
from gtts import gTTS
from io import BytesIO
import base64

app = Flask(__name__)

# Initialize the language model
llm = ollama.Ollama(model="llama3")

DEFAULT_SYSTEM_PROMPT ="""\
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

prompt_template = PromptTemplate(
    input_variables=["questions"],
    template=f"""Questions: {{questions}}

."""
)

def text_to_speech(text):
    if text:
        tts = gTTS(text=text, slow=False)
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return base64.b64encode(audio_buffer.read()).decode('utf-8')
    else:
        return ''

@app.route('/ask', methods=['POST'])
def ask():
    if request.method=='POST':
        data = request.json
        text = data.get('text', '')
        prompt_text = prompt_template.format(questions=questions)

        response = llm(prompt_text)
        formatted_response = response.replace("**", "")
        audio_base64 = text_to_speech(response)
        return jsonify({
            "question":questions,
            "response": response,
            "audio_base64": audio_base64
        })
    else:
        return jsonify({"error": "No 'text' field provided in the request."}), 400

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=8080)



