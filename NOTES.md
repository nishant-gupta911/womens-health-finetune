# Women's Health AI
Datasets researched: ChatDoctor, MedQuad, MedAlpaca
# Filter keywords for women's health topics
base_model: unsloth/Llama-3.2-3B-Instruct
First training attempt - hit OOM error on T4
Fixed: batch_size=1, grad_accumulation=16
Added Drive checkpoint saving every 100 steps
Training complete: loss=0.698, steps=3056, epochs=2
Merged LoRA adapters into base model
