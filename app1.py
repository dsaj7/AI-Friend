import streamlit as st # type: ignore
from transformers import AutoTokenizer, AutoModelForCausalLM, pipeline
import torch
from gtts import gTTS
from io import BytesIO
import base64

# Initialize Streamlit app
st.title('Ai friend')

# Initialize your model and tokenizer
tokenizer = AutoTokenizer.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Meta-Llama-3-8B-Instruct")
pipe = pipeline("text-generation", model=model, tokenizer=tokenizer, max_length=512, device=0)

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

def generate_response(text, citation=None):
    prompt = get_prompt(text, citation=citation)
    inputs = tokenizer(prompt, return_tensors="pt")
    with torch.no_grad():
        outputs = model.generate(**inputs, max_length=512)
        final_outputs = tokenizer.batch_decode(outputs, skip_special_tokens=True)[0]
        final_outputs = cut_off_text(final_outputs, '')
        final_outputs = remove_substring(final_outputs, prompt)

    return final_outputs

def text_to_speech(text):
    if text:
        tts = gTTS(text=text, slow=False)
        audio_buffer = BytesIO()
        tts.write_to_fp(audio_buffer)
        audio_buffer.seek(0)
        return base64.b64encode(audio_buffer.read()).decode('utf-8')
    else:
        return ''  # Return an empty string if no text is provided

st.sidebar.title('Text-to-Speech AI')
user_input = st.sidebar.text_area("Input your text here:")

if st.sidebar.button("Generate Response"):
    response = generate_response(user_input)
    st.markdown(f"**AI Response:** {response}")

    audio_base64 = text_to_speech(response)
    if audio_base64:
        st.audio(base64.b64decode(audio_base64), format='audio/wav')

st.sidebar.text("")
st.sidebar.text("This app uses Hugging Face transformers for AI text generation and gTTS for speech synthesis.")
