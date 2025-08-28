import json
import re
import ast

data_file = "data/testdaten3_v2.json"

with open(data_file, 'r', encoding='utf-8') as datei:
    data = json.load(datei)

for num, entry in enumerate(data):
    final_text = []
    human = entry["conversations"][0]["value"]
    schnitte = entry["conversations"][1]["value"]
    schnitte = ast.literal_eval(schnitte)

    match = re.search(r'Transkript: (.*)', human, re.DOTALL)
    if match:
        transkript = match.group(1).strip()

    transkript_list = transkript.split("]")

    transkript_list = [wort.replace("[", "") for wort in transkript_list if wort != "" ]

    for wort_complex in transkript_list:
        wort, start, end = wort_complex.rsplit(" ", 2)
        start = start.replace(",", "")
        start = float(start)
        end = float(end)

        for cut_start, cut_end in schnitte:
            if (start >= cut_start) and (end <= cut_end):
                final_text.append(wort)
                break

    final_text = " ".join(final_text)
    with open("approve_ai_data.txt", "a", encoding="utf-8") as output_file:
        output_file.write(final_text + "\n")
    
print(num+1)