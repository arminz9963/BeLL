import json
import csv
import re

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

def csv_sharegpt():
    data_list = []
    test_list = []
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


def fuse_ai_and_human_data(num_ai, num_human, name_ai, name_human, new_name):
    with open(f"data/{name_ai}.json", "r", encoding="utf-8") as file:
        ai_data = json.load(file)

    with open(f"data/{name_human}.json", "r", encoding="utf-8") as file:
        human_data = json.load(file)

    # Kombiniere die Daten
    combined_data = human_data[:num_human] + ai_data[:num_ai]

    with open(f"data/{new_name}.json", "w", encoding="utf-8") as file:
        json.dump(combined_data, file, ensure_ascii=False, indent=4)

def sharegpt_alpaca(sharegpt, alpaca):
    with open(f"data/{sharegpt}.json", "r", encoding="utf-8") as file:
        sharegpt_data = json.load(file)

    alpaca_entrys = []

    for entry in sharegpt_data:
        prompt = entry["conversations"][0]["value"]
        input_value = prompt.replace("Bitte schlage passende Schnittpunkte vor basierend auf dem Transkript und der Beschreibung. \n ", "")

        response = entry["conversations"][1]["value"]
        
        alpaca_entry = {
            "instruction": "Schlage passende Schnittpunkte vor basierend auf der Beschreibung und dem Transkript.",
            "input": input_value,
            "response": response
        }
        alpaca_entrys.append(alpaca_entry)

    with open(f"data/{alpaca}.json", "w", encoding="utf-8") as file:
        json.dump(alpaca_entrys, file, ensure_ascii=False, indent=4)

# sharegpt_alpaca("testdaten3_v2", "testdaten3_v2_alpaca")

def roh_alpaca(alpaca):
    with open(f"data/roh.json", "r", encoding="utf-8") as file:
        roh_data = json.load(file)

    alpaca_entrys = []

    for entry in roh_data:
        transkript = entry["transcription"]
        beschreibung = entry["cutPrompt"]
        output = entry["cuts"]

        # Umwandeln des Schnittformat ins eigene:
        time_parts = output.split("|")
        times = [tuple(eval(part)) for part in time_parts]

        pattern = r"(.*?)\[(\d+\.?\d*),(\d+\.?\d*)\]"
        matches = re.findall(pattern, transkript)

        parts = []
        for word, start, end in matches:
            start = round(float(start), 2)
            end = round(float(end), 2)
            parts.append(f"{word.strip()} [{start}, {end}]")

        transkript = " ".join(parts)

        # Runden der Zeiten im Transkript & Cuts
        response = [(round(start, 2), round(end, 2)) for start, end in times]

        alpaca_entry = {
            "instruction": "Schlage passende Schnittpunkte vor basierend auf der Beschreibung und dem Transkript.",
            "input": f"Beschreibung: {beschreibung}\nTranskript: {transkript}",
            "response": str(response)
        }
        alpaca_entrys.append(alpaca_entry)

    with open(f"data/{alpaca}.json", "w", encoding="utf-8") as file:
        json.dump(alpaca_entrys, file, ensure_ascii=False, indent=4)

# roh_alpaca("trainingsdaten_roh_alpaca")

# sharegpt_alpaca("ai_data", "ai_data_alpaca")

# fuse_ai_and_human_data(100, 306, "ai_data_alpaca", "trainingsdaten_roh_alpaca", "trainingsdaten_lo_alpaca")

# sharegpt_alpaca("trainingsdaten3", "trainingsdaten3_alpaca")

# fuse_ai_and_human_data(426, 20, "trainingsdaten_lo_alpaca", "trainingsdaten3_alpaca", "trainingsdaten_end_alpaca")


# fuse_ai_and_human_data(100, 20, "ai_data_alpaca", "trainingsdaten3_alpaca", "sigma")

# fuse_ai_and_human_data(10, 10, "testdaten3_v2_alpaca", "trainingsdaten_roh_alpaca", "testdaten3_v3_alpaca")

### Für den letzten Datensatz

# with open("data/sigma.json", "r", encoding="utf-8") as file:
#     sigma_data = json.load(file)

# with open("data/trainingsdaten_roh_alpaca.json", "r", encoding="utf-8") as file:
#     data = json.load(file)

# fused_data = data[10:] + sigma_data

# with open("data/trainingsdaten_end_alpaca.json", "w", encoding="utf-8") as file:
#     json.dump(fused_data, file, ensure_ascii=False, indent=4)


with open("data/testdaten3_v3_alpaca.json", "r", encoding="utf-8") as file:
    end_data = json.load(file)

print(len(end_data))  # Ausgabe der Anzahl der Einträge
