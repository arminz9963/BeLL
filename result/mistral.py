from mistralai import Mistral
import json
from time import time

with open("result/mistral_key.txt", "r") as f:
    api_key = f.read().strip()

# Mistral Small 2409 22B
model = "mistral-small-2409"

client = Mistral(api_key=api_key)

start = time()
with open("data/testdaten5.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    for i, dataset in enumerate(data):
        print("########################################################################")
        print("Test Nummer:", i + 1)

        prompt = f"Du bist ein Videoschnitt Assistent. Bitte gib im Folgenden nur die Schnitte des Videos wieder im folgenden Format: [(start1, ende1), (start2, ende2), ..] die Zeiten von start und ende in Sekunden. Bitte gib nur die Schnitte wieder, ohne jegliches Wort, Anführungszeichen oder Sonstiges! {dataset['conversations'][0]['value']}"

        chat_response = client.chat.complete(
        model= model,
        messages = [
        {
            "role": "user",
            "content": prompt,
        },
        ]
        )

        response = chat_response.choices[0].message.content
        lsg = dataset['conversations'][1]['value']
        print(f"Ausgabe: {response}")
        print(f"Lösung: {lsg}")
        with open("tests/test_result_mistral_nemo.txt", "a", encoding="utf-8") as datei:
            datei.writelines(f"Test {i+1}\nAusgabe: {response}\nLösung: {lsg}\n")
ges_time = time() - start

with open("tests/test_result_mistral_nemo.txt", "a", encoding="utf-8") as datei:
    datei.writelines(f"Gesamtzeit: {ges_time}")