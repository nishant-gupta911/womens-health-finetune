---
title: Womens Health Ai
emoji: 🌸
colorFrom: pink
colorTo: purple
sdk: gradio
sdk_version: "4.0.0"
python_version: "3.12"
app_file: app.py
pinned: false
license: mit
short_description: A judgment-free AI trained on women's health
---

# 🌸 Aria — Women's Health AI

![Python](https://img.shields.io/badge/Python-3.12-3776ab?logo=python&logoColor=white) ![PyTorch](https://img.shields.io/badge/PyTorch-2.0-ee4c2c?logo=pytorch&logoColor=white) ![LLaMA](https://img.shields.io/badge/LLaMA-3.2%203B-ff6b6b) ![Unsloth](https://img.shields.io/badge/Unsloth-FastQLoRA-00d084) ![QLoRA](https://img.shields.io/badge/QLoRA-4bit-ffd700) ![HuggingFace](https://img.shields.io/badge/HuggingFace-Models-ffd21e?logo=huggingface&logoColor=black) ![Next.js](https://img.shields.io/badge/Next.js-15-000?logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-5-3178c6?logo=typescript&logoColor=white) ![Ollama](https://img.shields.io/badge/Ollama-LocalLLMs-000?logo=docker&logoColor=white) ![MIT License](https://img.shields.io/badge/License-MIT-blue)

> A fine-tuned LLaMA 3.2 3B model trained on 24,000+ real medical conversations to answer women's health questions — privately, honestly, and without judgment.

---

## The Problem

Women delay seeking help for gynecological issues for years because of shame and embarrassment. Existing period tracking apps are useless when you actually need an answer. Google gives anxiety. Generic AI models hedge every response with disclaimers because they're trained on everything, so they default to caution. There was no open-source model specifically trained to answer women's health questions clearly and directly.

I built Aria to fix that gap.

---

## Try It

**Run with Ollama** (single command, runs locally):
```bash
ollama pull Nishantgupta911/womens-health-ai
ollama run womens-health
```

**Or use the web UI:**
- HuggingFace Space: [huggingface.co/spaces/Nishantgupta911/womens-health-ai](https://huggingface.co/spaces/Nishantgupta911/womens-health-ai)
- Run locally: See setup instructions below

**Example conversation:**

```
User: What does brown discharge before my period mean?

Aria: Brown discharge before your period is usually old blood — it took 
a bit longer to leave the uterus and oxidized on the way out. It's extremely 
common and almost always harmless. You'll typically see it in the day or two 
before your period starts properly. If it lasts longer than a few days or has 
a strong odor, check in with your doctor, but in isolation it's nothing to 
worry about.
```

---

## What It Covers

| Category | Topics |
|---|---|
| **Menstrual Health** | Periods, PMS, PMDD, irregular cycles, spotting, heavy bleeding |
| **Vaginal Health** | Discharge, bacterial vaginosis, yeast infections, UTIs |
| **Sexual Health** | STIs, contraception options, libido, pain during sex |
| **Reproductive Health** | PCOS, endometriosis, fibroids, ovulation, fertility |
| **Hormonal Health** | Estrogen, progesterone, thyroid, mood swings |
| **Pregnancy** | Early symptoms, complications, postpartum recovery |
| **Menopause** | Perimenopause, hot flashes, HRT, vaginal dryness |
| **Breast Health** | Self-examination, lumps, pain, changes over time |
| **Mental Health** | Cycle-related anxiety, depression, body image issues |

---

## Architecture & Technical Decisions

### Why Fine-Tune Instead of Prompt Engineering?

System prompts on general models still produce hedged, overly cautious responses. The model defaults to "I'm not a doctor" disclaimers because it's trained on everything. Fine-tuning shifts the model's prior — it learns to answer women's health questions the way a specialist would, by default. The difference is stark on sensitive topics where general models add unnecessary disclaimers that make the response less useful.

### Why LLaMA 3.2 3B?

- Fits comfortably in 15GB VRAM with QLoRA
- Strong instruction following from Meta's chat fine-tune
- Good multilingual base (preparing for Hindi support)
- Free to use and modify — no licensing nonsense

### Why QLoRA Specifically?

Full fine-tuning of 3.2B parameters needs 80GB+ GPU memory — impossible on free tier. LoRA adds small trainable "adapters" (rank 16) alongside frozen weights, so only the adapters learn. With 4-bit quantization of the base model, the whole thing fits in a T4's 15GB. I trained only 48.6M parameters (1.49% of total) while keeping quality nearly identical to full fine-tuning.

### Training Infrastructure

| Component | Choice | Why |
|---|---|---|
| Base Model | LLaMA 3.2 3B Instruct | Best quality/efficiency tradeoff for T4 |
| Training Method | QLoRA 4-bit | Only realistic option on free GPU |
| Framework | Unsloth | ~2x faster than vanilla HuggingFace |
| Hardware | Google Colab T4 | Free tier |
| Trainer | HuggingFace Trainer | SFTTrainer had versioning hell |
| Dataset | 24,444 conversations | Filtered from 3 medical datasets |
| Epochs | 2 | Loss plateaued; more just wastes time |
| LoRA Rank | 16 | Good capacity/memory tradeoff |
| Max Length | 1024 tokens | T4 shared memory limit |

### Training Results

| Metric | Value |
|---|---|
| Total Training Steps | 3,056 |
| Final Training Loss | 0.698 |
| Final Validation Loss | 1.404 |
| Trainable Parameters | 48,627,712 (1.49% of total) |
| Total Training Time | ~9 hours (across multiple sessions) |
| Hardware | NVIDIA T4 16GB |

Validation loss decreased consistently from 1.47 → 1.40. No overfitting, model actually learned the domain.

### Dataset

Used three public medical datasets filtered for women's health:

1. **lavita/ChatDoctor** (100k examples) — real patient questions to doctors
2. **keivalya/MedQuad** (47k examples) — structured medical Q&A
3. **medalpaca/medical_meadow_medqa** (40k examples) — medical education

Filtered all three using keyword matching for women's health terms. Also generated 222 synthetic Q&A pairs for underrepresented topics (PMDD, endometriosis, etc.).

**Final dataset:** 24,444 training examples + 2,717 validation examples.

---

## Project Structure

```
aria/
├── womens_health_ai_qlora_colab.ipynb    # Complete training pipeline
├── app.py                                 # Gradio web interface
├── Modelfile                              # Ollama model config
├── requirements.txt
├── frontend/                              # Next.js web UI
│   ├── src/
│   │   ├── app/
│   │   │   ├── api/
│   │   │   │   └── chat/route.ts         # Ollama streaming API
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   └── components/
│   │       ├── ChatWindow.tsx
│   │       ├── MessageBubble.tsx
│   │       ├── InputBar.tsx
│   │       ├── Header.tsx
│   │       ├── DisclaimerModal.tsx
│   │       └── ExamplePills.tsx
│   ├── package.json
│   ├── next.config.ts
│   ├── tsconfig.json
│   └── README.md
└── womens_health_ai/
    ├── final_model/
    │   ├── adapters/                    # LoRA weights (~185MB)
    │   ├── merged_model/                # Full merged model
    │   ├── tokenizer/
    │   └── womens-health-q4.gguf       # Quantized for Ollama
```

---

## Local Setup

### Prerequisites

- macOS with Apple Silicon (M1+) or Linux with NVIDIA GPU
- [Ollama](https://ollama.com) installed
- Node.js 18+ (for the web UI)

### Run with Ollama

Fastest way — just chat in the terminal:

```bash
# Install Ollama
brew install ollama

# Pull the model
ollama pull Nishantgupta911/womens-health-ai

# Chat
ollama run womens-health
```

On M1 Mac, runs at ~20-30 tokens/sec. On CPU, ~3 tokens/sec (plan accordingly).

### Run the Web UI Locally

```bash
cd frontend
npm install
npm run dev

# Open http://localhost:3000
```

The web UI connects to your local Ollama instance. Start Ollama first (`ollama serve`), then run the Next.js dev server.

### Retrain from Scratch

Open the notebook in Google Colab, set runtime to T4 GPU, run all cells:

```bash
womens_health_ai_qlora_colab.ipynb
```

~9 hours on free T4. You'll get the model in HuggingFace format; convert to GGUF for Ollama using llama.cpp.

---

## Honest Limitations

- **Small model.** 3B has less reasoning depth than 7B or 13B. It works well for straightforward questions, but struggles with complex scenarios.
- **Not exhaustive.** Rare conditions sometimes get generic responses. The training data was medical but not encyclopedic.
- **English only.** Hindi support is planned but not built.
- **Not medical advice.** This is for information. Always consult a real doctor for actual health concerns.
- **Slow on CPU.** ~45 seconds per response. GPU required for usable speed.
- **Limited context.** 1024 token window means very long conversations get truncated.

---

## What I'd Do Differently

- Use 7B model if GPU budget allowed (better quality, same training time)
- Train with DPO (Direct Preference Optimization) after SFT for better response quality
- Build a proper evaluation dataset reviewed by actual medical professionals
- Add RAG with PubMed abstracts for factual grounding
- Train with 2048 token sequences (if I fix the shared memory issue)

---

## Built By

**Nishant Gupta**  
Third-year CS (Data Science) — Manipal University Jaipur

- GitHub: [github.com/Nishantgupta911](https://github.com/Nishantgupta911)
- HuggingFace: [huggingface.co/Nishantgupta911](https://huggingface.co/Nishantgupta911)

---

## License

MIT — use it, build on it, just don't use it to replace actual doctors.

---

## Disclaimer

*Aria provides general health information only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider for personal medical concerns. This tool is for educational purposes.*
