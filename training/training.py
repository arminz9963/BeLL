### Multiprocessing deaktivieren sonst spackt es rum
import os
os.environ["TOKENIZERS_PARALLELISM"] = "false"
os.environ["HF_DATASETS_DISABLE_PROGRESS_BARS"] = "1"
os.environ["UNSLOTH_DISABLE_RL_METRICS"] = "1"  # UTF-8 Fix hinzugefügt
os.environ["PYTHONIOENCODING"] = "utf-8"  # UTF-8 Fix hinzugefügt

# Windows Multiprocessing Fix
if __name__ == '__main__':
    import multiprocessing
    multiprocessing.freeze_support()
    
    from unsloth import FastLanguageModel
    from unsloth.chat_templates import get_chat_template
    from datasets import load_dataset
    from unsloth.chat_templates import standardize_sharegpt
    ### Model laden
    model, tokenizer = FastLanguageModel.from_pretrained(
        model_name = "unsloth/Llama-3.2-1B-Instruct",
        max_seq_length = 2048,
        dtype = None,
        load_in_4bit = True,
    )
    ### Chat Template setzen
    tokenizer = get_chat_template(
        tokenizer,
        chat_template = "llama-3.1",
    )
    ### Daten laden und modifizieren
    dataset = load_dataset("json", data_files="data/trainingsdaten.json", split="train")
    def formatting_prompts_func(examples):
        convos = examples["conversations"]
        texts = [tokenizer.apply_chat_template(convo, tokenize=False, add_generation_prompt=False) for convo in convos]
        return { "text" : texts }
    dataset = dataset.map(formatting_prompts_func, batched=True, num_proc=None)  # num_proc=None für Windows Fix
    ### Training
    from trl import SFTConfig, SFTTrainer
    from transformers import DataCollatorForSeq2Seq
    trainer = SFTTrainer(
        model = model,
        tokenizer = tokenizer,
        train_dataset = dataset,
        dataset_text_field = "text",
        max_seq_length = 2048,
        data_collator = DataCollatorForSeq2Seq(tokenizer = tokenizer),
        packing = False, # Can make training 5x faster for short sequences.
        args = SFTConfig(
            per_device_train_batch_size = 2,
            gradient_accumulation_steps = 4,
            warmup_steps = 5,
            # num_train_epochs = 1, # Set this for 1 full training run.
            max_steps = 60,
            learning_rate = 2e-4,
            logging_steps = 1,
            optim = "adamw_8bit",
            weight_decay = 0.01,
            lr_scheduler_type = "linear",
            seed = 3407,
            output_dir = "outputs",
            report_to = "none", # Use this for WandB etc
            dataloader_num_workers = 0,  # Windows Fix
            dataloader_persistent_workers = False,  # Windows Fix
        ),
    )
    ## Auf Antwort fokussieren und nicht nur Frage/Antwort auswendig lernen
    from unsloth.chat_templates import train_on_responses_only
    trainer = train_on_responses_only(
        trainer,
        instruction_part = "<|start_header_id|>user<|end_header_id|>\n\n",
        response_part    = "<|start_header_id|>assistant<|end_header_id|>\n\n",
    )
    ## Training starten
    trainer_stats = trainer.train()
    ### GPU Stats
    import torch
    gpu_stats = torch.cuda.get_device_properties(0)
    used_memory = round(torch.cuda.max_memory_reserved() / 1024 / 1024 / 1024, 3)
    print(f"GPU: {gpu_stats.name}, Memory Used: {used_memory} GB")