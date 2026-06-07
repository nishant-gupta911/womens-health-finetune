#!/usr/bin/env python3
"""
FastAPI server for Aria — Women's Health AI companion.
Fine-tuned LLaMA 3.2 3B with strict persona enforcement and hallucination filtering.
"""

import os
import sys
import json
import logging
from pathlib import Path
from typing import Generator

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, field_validator
from llama_cpp import Llama

# ─────────────────────────────────────────────
# Logging
# ─────────────────────────────────────────────
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s  %(levelname)s  %(message)s",
    datefmt="%H:%M:%S",
)
log = logging.getLogger("aria")

# ─────────────────────────────────────────────
# Model loading
# ─────────────────────────────────────────────
SCRIPT_DIR = Path(__file__).parent
MODEL_PATH = SCRIPT_DIR / "womens_health_ai" / "final_model" / "womens-health-q4.gguf"

if not MODEL_PATH.exists():
    log.error("Model not found at %s", MODEL_PATH)
    sys.exit(1)

log.info("Loading model from %s …", MODEL_PATH)
try:
    llm = Llama(
        model_path=str(MODEL_PATH),
        n_ctx=2048,
        n_threads=8,           # Use more threads for prompt processing
        n_gpu_layers=-1,       # Offload all layers to GPU (Metal)
        flash_attn=True,       # Further speed up attention calculations
        verbose=False,
    )
    log.info("Model loaded successfully.")
except Exception as exc:
    log.exception("Failed to load model: %s", exc)
    sys.exit(1)

# ─────────────────────────────────────────────
# System prompt  (tuned for clarity + persona lock)
# ─────────────────────────────────────────────
SYSTEM_PROMPT = """You are Aria, a warm and supportive women's health companion.

Your personality:
- Speak like a knowledgeable, caring friend — never clinical or cold.
- Use simple, clear language. Avoid jargon unless you explain it.
- Be empathetic first when someone mentions pain or worry.
- Keep answers focused and concise (3-5 sentences for simple questions; up to a short paragraph for complex ones).

Hard rules you NEVER break:
1. Your name is Aria. NEVER call yourself "Chat Doctor", "ChatDoctor", or any other name.
2. Always speak in first person: "I think…", "I'd suggest…", "I can help with that."
3. NEVER use third person: never say "she", "her", "the patient", "it is causing concern to her".
4. You are NOT a licensed doctor. When a question needs professional care, say so clearly and kindly.
5. Stop immediately after completing your answer. Do not continue the conversation yourself.
6. Do not repeat the user's question back to them.
7. Never produce a "User:" or "Assistant:" turn — your response ends with your words only.

Health topics you cover well:
- Menstrual health (periods, PMS, PMDD, spotting, heavy bleeding)
- Vaginal health (discharge, BV, yeast infections, UTIs)
- Sexual health (STIs, contraception, libido, pain during sex)
- Reproductive health (PCOS, endometriosis, fibroids, fertility, ovulation)
- Hormonal health (estrogen, progesterone, thyroid, mood)
- Pregnancy (early symptoms, complications, postpartum)
- Menopause (perimenopause, HRT, hot flashes, dryness)
- Breast health (self-exam, lumps, pain)
- Cycle-related mental health (anxiety, depression, body image)"""

# ─────────────────────────────────────────────
# Tokens / strings that indicate hallucination
# ─────────────────────────────────────────────
STOP_SEQUENCES = [
    "<|im_end|>", "<|im_start|>",
    "\nUser:", "\nuser:",
    "\nAssistant:", "\nassistant:",
    "\nHuman:", "\nhuman:",
    "User:", "Human:",         # without newline too
]

PERSONA_FIXES = {
    "Chat Doctor": "Aria",
    "ChatDoctor": "Aria",
    "chat doctor": "Aria",
    "chatdoctor": "Aria",
}

HALLUCINATION_TRIGGERS = [
    "user:", "assistant:", "human:",
    "<|im_start|>", "<|im_end|>",
]

# ─────────────────────────────────────────────
# Greeting fast-path  (skip expensive inference)
# ─────────────────────────────────────────────
GREETINGS = {"hi", "hello", "hey", "hii", "hiii", "hiya", "sup", "yo"}

def is_greeting(text: str) -> bool:
    clean = text.lower().strip().rstrip("!.,?")
    return clean in GREETINGS

# ─────────────────────────────────────────────
# Request / Response models
# ─────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    history: list = []

    @field_validator("message")
    @classmethod
    def message_not_empty(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("message must not be empty")
        return v

# ─────────────────────────────────────────────
# Prompt builder
# ─────────────────────────────────────────────
def build_prompt(message: str, history: list) -> str:
    """
    Build a ChatML-formatted prompt.
    Uses the last 4 history turns (2 user + 2 assistant) to stay within context.
    """
    prompt = f"<|im_start|>system\n{SYSTEM_PROMPT}<|im_end|>\n"

    # Take last 4 exchanges (8 messages max) — more context without hitting the limit
    recent = history[-8:]
    for turn in recent:
        role = turn.get("role", "")
        content = turn.get("content", "").strip()
        if not content or role not in ("user", "assistant"):
            continue
        # Sanitise persona in historical assistant turns
        for bad, good in PERSONA_FIXES.items():
            content = content.replace(bad, good)
        prompt += f"<|im_start|>{role}\n{content}<|im_end|>\n"

    prompt += f"<|im_start|>user\n{message}<|im_end|>\n<|im_start|>assistant\n"
    return prompt

# ─────────────────────────────────────────────
# Streaming generator
# ─────────────────────────────────────────────
def stream_response(message: str, history: list) -> Generator[str, None, None]:
    """
    Yields SSE-formatted chunks: `data: {"message": {"content": "..."}}\n\n`
    """

    # ── Fast path: greetings ──────────────────────────────────────────────
    if is_greeting(message):
        greeting = "Hi there! 🌸 I'm Aria, your women's health companion. What's on your mind today?"
        yield f"data: {json.dumps({'message': {'content': greeting}})}\n\n"
        yield "data: [DONE]\n\n"
        return

    # ── Build prompt ──────────────────────────────────────────────────────
    prompt = build_prompt(message, history)
    log.info("Generating response for: %.80s…", message)

    # ── Inference ─────────────────────────────────────────────────────────
    try:
        output = llm(
            prompt,
            max_tokens=512,
            temperature=0.35,       # slightly higher than 0.3 → less repetition
            top_p=0.9,
            top_k=40,
            repeat_penalty=1.15,    # stronger than 1.1 → reduces looping
            stop=STOP_SEQUENCES,
            stream=True,
        )

        accumulated = ""

        for chunk in output:
            delta: str = chunk["choices"][0].get("text", "")
            if not delta:
                continue

            # ── Persona fix ──────────────────────────────────────────────
            for bad, good in PERSONA_FIXES.items():
                delta = delta.replace(bad, good)

            # ── Tag strip ────────────────────────────────────────────────
            delta = delta.replace("<|im_end|>", "").replace("<|im_start|>", "")

            accumulated += delta

            # ── Hallucination guard ──────────────────────────────────────
            # Only check the last 64 chars to keep it fast during streaming
            check_window = accumulated[-64:].lower()
            if any(trigger in check_window for trigger in HALLUCINATION_TRIGGERS):
                log.warning("Hallucination detected — stopping generation early.")
                break

            # ── Only emit non-empty deltas ───────────────────────────────
            if delta.strip() or delta in (" ", "\n"):
                yield f"data: {json.dumps({'message': {'content': delta}})}\n\n"

        log.info("Response complete (%d chars).", len(accumulated))

    except Exception as exc:
        log.exception("Inference error: %s", exc)
        error_msg = "I'm sorry, something went wrong on my end. Please try again in a moment. 🌸"
        yield f"data: {json.dumps({'message': {'content': error_msg}})}\n\n"

    finally:
        yield "data: [DONE]\n\n"

# ─────────────────────────────────────────────
# App
# ─────────────────────────────────────────────
app = FastAPI(title="Aria — Women's Health AI", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # tighten in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
# Routes
# ─────────────────────────────────────────────
@app.post("/api/chat")
async def chat(request: ChatRequest):
    """
    Stream a response from Aria.
    Request body: { "message": "...", "history": [{role, content}, ...] }
    """
    return StreamingResponse(
        stream_response(request.message, request.history),
        media_type="text/event-stream",          # ← was "text_event-stream" (bug fixed)
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",           # disables nginx buffering → true streaming
        },
    )


@app.get("/health")
async def health():
    return {"status": "ok", "model": "womens-health-q4", "name": "Aria"}


# ─────────────────────────────────────────────
# Entry point
# ─────────────────────────────────────────────
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )