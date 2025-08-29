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
    model_path="models/model_v11.Q4_K_M.gguf",
    n_ctx=15000,
    verbose=False
)

with open("data/testdaten3_v2_alpaca.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    for i, dataset in enumerate(data):
        print("########################################################################")
        print("Test Nummer:", i + 1)
        system = "Du bist ein Video-Editing Assistant. Analysiere das folgende Transkript und gib passende Schnittvorschläge zurück, beachte hierbei die mitgegebene Beschreibung."
        #prompt = f"{dataset['conversations'][0]['value']}\n"
        prompt = f"{dataset['instruction']} \n{dataset['input']}"
        message = [
            {"role": "system", "content": system},
            {"role": "user", "content": prompt}
            ]
        output = llm.create_chat_completion(messages=message)
        answer = output['choices'][0]['message']['content'].strip()
        print(f"Ausgabe: {answer}")
        print(f"Lösung: {dataset['response']}")
        with open("tests/neu/test_result_v11.txt", "a", encoding="utf-8") as datei:
            datei.writelines(f"Test {i+1}\nAusgabe: {answer}\nLösung: {dataset['response']}\n")
total_time = time.time() - start_time
print(f"Gesamtzeit: {total_time:.2f} Sekunden")
with open("tests/neu/test_result_v11.txt", "a", encoding="utf-8") as datei:
    datei.writelines(f"Gesamtzeit: {total_time}")