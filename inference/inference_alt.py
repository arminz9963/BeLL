import time
from llama_cpp import Llama
import json

start_time = time.time()

llm = Llama(
    model_path="models/model_v4.Q4_K_m.gguf",
    n_ctx=22000, # Maximale Kontextlänge
    verbose=False
)

with open("data/testdaten3.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    for i, dataset in enumerate(data):
        print("########################################################################")
        print("Test Nummer:", i + 1)
        prompt = f"{dataset['conversations'][0]['value']}\n" 
        # Prompt an LLM senden und Antwort erhalten 
        output = llm(prompt)
        answer = output['choices'][0]['text'].strip()
        print(f"Ausgabe: {answer}")
        print(f"Lösung: {dataset['conversations'][1]['value']}")
        with open("tests/alt/test_result_v4.txt", "a", encoding="utf-8") as datei:
            datei.writelines(
                f"Test {i+1}\nAusgabe: {answer}\nLösung: {dataset['conversations'][1]['value']}\n"
            )

total_time = time.time() - start_time
print(f"Gesamtzeit: {total_time:.2f} Sekunden")

with open("tests/alt/test_result_v4.txt", "a", encoding="utf-8") as datei:
    datei.writelines(f"Gesamtzeit: {total_time}")
