import json
import csv

data_list = []
test_list = []
with open("daten.csv", "r", encoding="utf-8") as file:
    csv_reader = csv.reader(file)
    next(csv_reader)  # Überspringe die Kopfzeile, falls vorhanden
    for i, row in enumerate(csv_reader):
        transkript = json.loads(row[0])
        schnitte = json.loads(row[1])
        beschreibung = json.loads(row[2])

        data = {
            "conversations": [
                {
                    "role": "user",
                    "content": f"Bitte schlage passende Schnittpunkte vor basierend auf dem Transkript und der Beschreibung. \n Beschreibung: {beschreibung} \n Transkript: {transkript}" 
                },
                {
                    "role": "assistant",
                    "content": schnitte
                }
            ]
        }
        if i < 20:
            data_list.append(data)
        else:
            test_list.append(data)

with open("Trainingsdaten.json", "w", encoding="utf-8") as json_file:
    json.dump(data_list, json_file, ensure_ascii=False, indent=4)

with open("Testdaten.json", "w", encoding="utf-8") as json_file:
    json.dump(test_list, json_file, ensure_ascii=False, indent=4)