import streamlit as st
from llama_cpp import Llama
import os

# Page config
st.set_page_config(
    page_title="🌸 Aria — Women's Health Assistant",
    page_icon="🌸",
    layout="centered",
)

st.title("🌸 Aria — Women's Health Assistant")
st.markdown("Ask anything about your body. Periods, hormones, sexual health, discharge, PCOS, menopause. **Judgment-free zone.** *Not a substitute for professional medical advice.*")

# Load model once
@st.cache_resource
def load_model():
    print("Loading local GGUF model...")
    model_path = "womens_health_ai/final_model/womens-health-f16.gguf/womens-health-f16-001.gguf"
    
    # Verify model file exists
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Model file not found at: {model_path}")
    print(f"Model found at {model_path}")
    
    llm = Llama(
        model_path=model_path,
        n_ctx=2048,
        n_threads=4,
        verbose=False,
    )
    print("Model loaded!")
    return llm

# System prompt
SYSTEM_PROMPT = """You are Aria, a warm, knowledgeable, and completely judgment-free women's health companion. You were created to give every woman access to the medical knowledge she deserves — privately, safely, and without shame.

You are trained in all areas of women's health including:
- Menstrual health (periods, PMS, PMDD, irregular cycles, spotting)
- Vaginal health (discharge, odor, infections like BV, yeast, UTIs)
- Sexual health (STIs, contraception, libido, pain during sex, consent)
- Reproductive health (PCOS, endometriosis, fibroids, ovulation, fertility)
- Hormonal health (estrogen, progesterone, thyroid, mood, weight changes)
- Pregnancy (symptoms, changes, complications, postpartum)
- Menopause and perimenopause (hot flashes, dryness, mood, HRT)
- Breast health (lumps, pain, changes, self-examination)
- Mental health connected to the female body

Your personality:
- You speak like a knowledgeable best friend who also happens to be a doctor
- You never make a woman feel embarrassed for asking anything
- You use clear simple language
- You are direct and honest
- You never shame or judge any concern

Remember: Many women come to you because they have nobody else to ask. Treat that trust with care."""

def respond(message, llm):
    prompt = f"<|im_start|>system\n{SYSTEM_PROMPT}\n<|im_end|>\n<|im_start|>user\n{message}\n<|im_end|>\n<|im_start|>assistant\n"
    output = llm(
        prompt,
        max_tokens=512,
        temperature=0.7,
        top_p=0.9,
        repeat_penalty=1.1,
        stop=["<|im_end|>", "<|im_start|>"],
    )
    return output["choices"][0]["text"].strip()

# Example questions
examples = [
    "What does brown discharge before my period mean?",
    "What's the difference between BV and a yeast infection?",
    "Why do I feel so emotional the week before my period?",
    "Is pain during sex normal?",
    "What are early signs of menopause?",
    "How does the pill affect my mood and libido?",
    "Can I get an STI without penetrative sex?",
    "I haven't had my period in 2 months — what could cause this?",
]

# Load model
try:
    llm = load_model()
except Exception as e:
    st.error(f"Error loading model: {e}")
    st.stop()

# Chat history
if "messages" not in st.session_state:
    st.session_state.messages = []

# Display chat history
for message in st.session_state.messages:
    with st.chat_message(message["role"]):
        st.markdown(message["content"])

# User input
if user_input := st.chat_input("Ask Aria anything about women's health..."):
    # Add user message to history
    st.session_state.messages.append({"role": "user", "content": user_input})
    with st.chat_message("user"):
        st.markdown(user_input)
    
    # Get response from model
    with st.chat_message("assistant"):
        with st.spinner("Thinking..."):
            response = respond(user_input, llm)
        st.markdown(response)
    
    # Add assistant message to history
    st.session_state.messages.append({"role": "assistant", "content": response})

# Show example questions
st.markdown("---")
st.markdown("### Example Questions")
cols = st.columns(2)
for i, example in enumerate(examples):
    with cols[i % 2]:
        if st.button(example, key=f"example_{i}", use_container_width=True):
            st.session_state.messages.append({"role": "user", "content": example})
            with st.chat_message("user"):
                st.markdown(example)
            
            with st.chat_message("assistant"):
                with st.spinner("Thinking..."):
                    response = respond(example, llm)
                st.markdown(response)
            
            st.session_state.messages.append({"role": "assistant", "content": response})
            st.rerun()
