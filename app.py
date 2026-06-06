import gradio as gr
from llama_cpp import Llama
from huggingface_hub import hf_hub_download
import os

print("Downloading GGUF model...")
model_path = hf_hub_download(
    repo_id="Nishantgupta911/womens-health-ai-gguf",
    filename="womens-health-q4.gguf",
)
print(f"Model downloaded to {model_path}")

llm = Llama(
    model_path=model_path,
    n_ctx=2048,
    n_threads=4,
    verbose=False,
)
print("Model loaded!")

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

def respond(message, history):
    prompt = f"<|im_start|>system\n{SYSTEM_PROMPT}\n<|im_end|>\n<|im_start|>user\n{message}\n<|im_end|>\n<|im_start|>assistant\n"
    output = llm(
        prompt,
        max_tokens=150,
        temperature=0.7,
        top_p=0.9,
        repeat_penalty=1.1,
        stop=["<|im_end|>", "<|im_start|>"],
    )
    return output["choices"][0]["text"].strip()

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

demo = gr.ChatInterface(
    fn=respond,
    title="🌸 Aria — Women's Health Assistant",
    description="Ask anything about your body. Periods, hormones, sexual health, discharge, PCOS, menopause. **Judgment-free zone.** *Not a substitute for professional medical advice.*",
    examples=examples,
)

demo.launch()

# Aria Interface
