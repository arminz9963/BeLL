import time
from llama_cpp import Llama
import json
start_time = time.time()

# llm =Llama.from_pretrained(
#     repo_id="arminz9963/bell",
#     filename="model_v8.Q4_K_M.gguf",
#     n_ctx=15000,
#     verbose=False
# )


llm = Llama(
    model_path="models/model_v1.Q4_K_M.gguf",
    n_ctx=15000, # Maximale Kontextlänge
    verbose=False
)


with open("data/testdaten1.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    for i, dataset in enumerate(data):
        print("########################################################################")
        print("Test Nummer:", i + 1)
        system = "Du bist ein Video-Editing Assistant. Analysiere das folgende Transkript und gib passende Schnittvorschläge zurück, beachte hierbei die mitgegebene Beschreibung."
        # Prompt in Message Format
        prompt = f"{dataset['conversations'][0]['value']}"
        message = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
            ]
        # Prompt an LLM senden und Antwort erhalten
        output = llm.create_chat_completion(messages=message)
        # Antwort extrahieren
        answer = output['choices'][0]['message']['content'].strip()
        print(f"Ausgabe: {answer}")
        print(f"Lösung: {dataset['conversations'][1]['value']}")
        with open("tests/test_result_v1.txt", "a", encoding="utf-8") as datei:
            datei.writelines(f"Test {i+1}\nAusgabe: {answer}\nLösung: {dataset['conversations'][1]['value']}\n")
total_time = time.time() - start_time
print(f"Gesamtzeit: {total_time:.2f} Sekunden")
with open("tests/test_result_v1.txt", "a", encoding="utf-8") as datei:
    datei.writelines(f"Gesamtzeit: {total_time}")