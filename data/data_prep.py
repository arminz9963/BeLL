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
    Funktion, die die Schnitteformat umwandelt
    """
    neue_schnitte = []
    for schnitt in schnitte:
        schnitt = tuple(schnitt)
        neue_schnitte.append(schnitt)
    return str(neue_schnitte)

def csv_sharegpt():
    """
    Funktion, die die CSV Datei in das ShareGPT Format umwandelt.
    """

    data_list = []
    test_list = []
    with open("data/daten.csv", "r", encoding="utf-8") as file:
        csv_reader = csv.reader(file)
        next(csv_reader)  # Überspringe die Kopfzeile
        for i, row in enumerate(csv_reader):
            transkript = json.loads(row[0])
            schnitte = json.loads(row[1])
            beschreibung = json.loads(row[2])

            data = {
                "conversations": [
                    {
                        "from": "human",
                        "value": f"Bitte schlage passende Schnittpunkte vor basierend auf dem Transkript und der Beschreibung. \n Beschreibung: {beschreibung} \n Transkript: {transkript}" 
                    },
                    
                    {
                        "from": "gpt",
                        "value": schnitte
                    }
                ]
            }
            if i < 20:
                data_list.append(data)
            else:
                test_list.append(data)

    with open("data/trainingsdaten1.json", "w", encoding="utf-8") as json_file:
        json.dump(data_list, json_file, ensure_ascii=False, indent=4)

    with open("data/testdaten1.json", "w", encoding="utf-8") as json_file:
        json.dump(test_list, json_file, ensure_ascii=False, indent=4)


def fuse_ai_and_human_data(num_ai, num_human, name_ai, name_human, new_name):
    """
    Funktion die AI und Human Daten kombiniert.
    """

    with open(f"data/{name_ai}.json", "r", encoding="utf-8") as file:
        ai_data = json.load(file)

    with open(f"data/{name_human}.json", "r", encoding="utf-8") as file:
        human_data = json.load(file)

    # Kombiniere die Daten
    combined_data = human_data[:num_human] + ai_data[:num_ai]

    with open(f"data/{new_name}.json", "w", encoding="utf-8") as file:
        json.dump(combined_data, file, ensure_ascii=False, indent=4)

def sharegpt_alpaca(sharegpt, alpaca):
    """
    Funktion die ShareGPT Daten in das Alpaca Format umwandelt.
    """

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

def roh_alpaca(alpaca):
    """
    Funktion, die die Rohdaten (Daten von Herrn Rose) in das Alpaca Format umwandelt.
    """
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
        response = [(round(start, 2), round(end, 2)) for start, end in times]

        # Regex: "Video[12.5,13.1]" --> "Video", "12.5", "13.1"
        pattern = r"(.*?)\[(\d+\.?\d*),(\d+\.?\d*)\]"
        matches = re.findall(pattern, transkript)

        parts = []
        for word, start, end in matches:
            start = round(float(start), 2)
            end = round(float(end), 2)
            parts.append(f"{word.strip()} [{start}, {end}]")

        transkript = " ".join(parts)

        alpaca_entry = {
            "instruction": "Schlage passende Schnittpunkte vor basierend auf der Beschreibung und dem Transkript.",
            "input": f"Beschreibung: {beschreibung}\nTranskript: {transkript}",
            "response": str(response)
        }
        alpaca_entrys.append(alpaca_entry)

    with open(f"data/{alpaca}.json", "w", encoding="utf-8") as file:
        json.dump(alpaca_entrys, file, ensure_ascii=False, indent=4)
