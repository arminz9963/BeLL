import google.generativeai as genai
import json
from time import time

### api key unter https://aistudio.google.com/api-keys erstellen und in result/gemini_key.txt speichern
with open("result/gemini_key.txt", "r") as f:
    api_key = f.read().strip()

genai.configure(api_key=api_key)

model = genai.GenerativeModel("gemini-2.5-flash")

start = time()
with open("data/testdaten5.json", "r", encoding="utf-8") as file:
    data = json.load(file)
    for i, dataset in enumerate(data):
        print("########################################################################")
        print("Test Nummer:", i + 1)

        prompt = f"Du bist ein Videoschnitt Assistent. Bitte gib im Folgenden nur die Schnitte des Videos wieder im folgenden Format: [(start1, ende1), (start2, ende2), ..] die Zeiten von start und ende in Sekunden. Bitte gib nur die Schnitte wieder, ohne jegliches Wort, Anführungszeichen oder sonstiges! {dataset['conversations'][0]['value']}"
        response = model.generate_content(prompt)
        lsg = dataset['conversations'][1]['value']
        print(f"Ausgabe: {response.text}")
        print(f"Lösung: {lsg}")
        with open("tests/test_result_gemini.txt", "a", encoding="utf-8") as datei:
            datei.writelines(f"Test {i+1}\nAusgabe: {response.text}\nLösung: {lsg}\n")
ges_time = time() - start

with open("tests/test_result_gemini.txt", "a", encoding="utf-8") as datei:
    datei.writelines(f"Gesamtzeit: {ges_time}")