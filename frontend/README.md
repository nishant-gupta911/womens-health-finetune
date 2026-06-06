# Aria — Women's Health AI

I spent about 2 months building this. Started with the idea that women 
don't have a private, honest place to ask health questions without 
feeling judged. Flo tracks your period. Google gives you cancer. 
Doctors cost money and time. I wanted something different.

## What it is
A locally-running AI trained specifically on women's health. Periods, 
discharge, sexual health, PCOS, menopause, hormones — you can ask 
anything and it answers like a knowledgeable friend, not a liability-scared 
medical website.

## How it works
I fine-tuned LLaMA 3.2 3B using QLoRA on 24,000+ real doctor-patient 
conversations filtered for women's health topics. The model runs on your 
machine via Ollama — nothing leaves your device.

This frontend is Next.js 14 with TypeScript. The chat connects to Ollama 
at localhost:11434. That's it.

## Setup

Make sure Ollama is running with the model loaded:
```bash
ollama serve
ollama run womens-health
```

Then:
```bash
npm install
npm run dev
```

Open http://localhost:3000

## Stack
- Next.js 14 App Router
- TypeScript
- Tailwind CSS  
- shadcn/ui
- Ollama (local inference)
- LLaMA 3.2 3B fine-tuned with QLoRA

## Training
The model was trained on Google Colab T4 GPU over multiple sessions 
using Unsloth for faster training. Final loss: 0.698 over 3056 steps 
across 2 epochs. LoRA rank 16, 4-bit quantization.

Built by Nishant Gupta — CS (Data Science), Manipal University Jaipur
