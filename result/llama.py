from groq import Groq
from time import time
import json

### Api Key unter https://console.groq.com/keys erstellen und in result/llama_key.txt speichern
with open("result/llama_key.txt", "r") as f:
    api_key = f.read().strip()

client = Groq(api_key=api_key)
model = "llama-3.3-70b-versatile"

start = time()
with open("data/testdaten5.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    for i, dataset in enumerate(data):
        print("########################################################################")
        print("Test Nummer:", i + 1)
        prompt = f"{dataset['conversations'][0]['value']}"
        
        completion = client.chat.completions.create(
            model=model,
            messages=[
            {
                "role": "system",
                "content": "Du bist ein Videoschnitt Assistent. Bitte gib im Folgenden nur die Schnitte des Videos wieder im folgenden Format: [(start1, ende1), (start2, ende2), ..] die Zeiten von start und ende in Sekunden. Bitte gib nur die Schnitte wieder, ohne jegliches Wort, Anführungszeichen oder Sonstiges! "
            },
            {
                "role": "user",
                "content": prompt
            }
            ],
            stream=False
        )
        # extrahieren der Antwort
        response = completion.choices[0].message.content

        lsg = dataset['conversations'][1]['value']
        print(f"Ausgabe: {response}")
        print(f"Lösung: {lsg}")
        with open("tests/test_result_llama.txt", "a", encoding="utf-8") as datei:
            datei.writelines(f"Test {i+1}\nAusgabe: {response}\nLösung: {lsg}\n")
ges_time = time() - start

with open("tests/test_result_llama.txt", "a", encoding="utf-8") as datei:
    datei.writelines(f"Gesamtzeit: {ges_time}")