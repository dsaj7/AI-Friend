from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
import speech_recognition as sr
import pyttsx3
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline, BitsAndBytesConfig
import torch
import textwrap
from huggingface_hub import login
from gtts import gTTS
from io import BytesIO
import base64

app = Flask(__name__)
CORS(app)

# Authentication
login(token='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', add_to_git_credential=True)

# Quantization configuration
quant_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_compute_dtype=torch.float16,
    load_in_8bit_fp32_cpu_offload=True
)

# Load the model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Meta-Llama-3-8B-Instruct",
    device_map='auto',
    quantization_config=quant_config
)

pipe = pipeline(
    "text-generation",
    model=model,
    tokenizer=tokenizer,
    torch_dtype=torch.float16,
    device_map="auto",
    max_new_tokens=512,
    do_sample=True,
    top_k=30,
    num_return_sequences=1,
    eos_token_id=tokenizer.eos_token_id
)

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

def cut_off_text(text, prompt):
    cutoff_phrase = prompt
    index = text.find(cutoff_phrase)
    if index != -1:
        return text[:index]
    else:
        return text

def remove_substring(string, substring):
    return string.replace(substring, "")

def generate(text, citation=None):
    prompt = get_prompt(text, citation=citation)
    inputs = tokenizer(prompt, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs,
                                 max_length=512,
                                 eos_token_id=tokenizer.eos_token_id,
                                 pad_token_id=tokenizer.eos_token_id)
        final_outputs = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        final_outputs = cut_off_text(final_outputs, '')
        final_outputs = remove_substring(final_outputs, prompt)

    return final_outputs

def parse_text(text):
    wrapped_text = textwrap.fill(text, width=100)
    return wrapped_text

def text_to_speech(text):
    if text:
        tts = gTTS(text=text, slow=False)
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return audio_buffer.read()
    else:
        return b''  # Return an empty bytes object if no text is provided

@app.route('/')
def index():
    return render_template('index.html')

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
    app.run(host='0.0.0.0', port=8080)
