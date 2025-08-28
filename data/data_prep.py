import json
import csv

data_list = []
test_list = []

def format_transkript(transkript):
    """
    Funktion die das JSON Transkript in ein lesbares Format umwandelt.
    """
    neues_transkript = ""
    for wort in transkript:
        neues_wort = ""
        neues_wort += wort['word']
        neues_wort += f" [{wort['start']:.2f}, {wort['end']:.2f}]"
        neues_transkript += neues_wort + " "

    return neues_transkript.strip()

def format_schnitte(schnitte):
    """
    Funktion die die Schnitteformat umwandelt
    """
    neue_schnitte = []
    for schnitt in schnitte:
        schnitt = tuple(schnitt)
        neue_schnitte.append(schnitt)
    return str(neue_schnitte)

def umwandeln():
    with open("data/daten.csv", "r", encoding="utf-8") as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Überspringe die Kopfzeile, falls vorhanden
        for i, row in enumerate(csv_reader):
            transkript = json.loads(row[0])
            schnitte = json.loads(row[1])
            beschreibung = json.loads(row[2])

            # Formatieren des Transkripts in ShareGPT Format
            # bei v5, folgende Line bei value from human hinzugefügt: Gib die Schnitte im folgenden Format wieder: [(start1, ende1), (start2, ende2), (start3, ende3), ...]
            data = {
                "conversations": [
                    {
                        "from": "human",
                        "value": f"Bitte schlage passende Schnittpunkte vor basierend auf dem Transkript und der Beschreibung. \n Beschreibung: {beschreibung} \n Transkript: {format_transkript(transkript)}" 
                    },
                    
                    {
                        "from": "gpt",
                        "value": format_schnitte(schnitte)
                    }
                ]
            }
            if i < 20:
                data_list.append(data)
            else:
                test_list.append(data)

    with open("data/trainingsdaten4.json", "w", encoding="utf-8") as json_file:
        json.dump(data_list, json_file, ensure_ascii=False, indent=4)

    with open("data/testdaten4.json", "w", encoding="utf-8") as json_file:
        json.dump(test_list, json_file, ensure_ascii=False, indent=4)

#umwandeln()

def fuse_ai_and_human_data(num_ai, num_human, name):
    with open(f"data/ai_data.json", "r", encoding="utf-8") as file:
        ai_data = json.load(file)

    with open(f"data/trainingsdaten3.json", "r", encoding="utf-8") as file:
        human_data = json.load(file)

    # Kombiniere die Daten
    combined_data = human_data[:num_human] + ai_data[:num_ai]

    with open(f"data/{name}.json", "w", encoding="utf-8") as file:
        json.dump(combined_data, file, ensure_ascii=False, indent=4)

fuse_ai_and_human_data(80, 20, "trainingsdaten_3_100_v1")