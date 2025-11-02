
def main():
    nums = ["1", "2", "3_1", "3_2", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13", "14", "15_1", "15_2", "16", "13_100", "17"]
    tests = [f"tests/test_result_v{num}.txt" for num in nums]

    for test in tests:
        scores = []
        with open(test, "r", encoding="utf-8") as datei:
            while True:
                line = datei.readline()
                # Ende der Datei
                if line.startswith("Gesamtzeit:"):
                    break
                else:
                    asg = datei.readline().strip().replace("Ausgabe:", "")

                    # Falsche Syntax z.B. [(1, 3))))
                    try:
                        asg = eval(asg)
                    except:
                        asg = []
                lsg = datei.readline().strip().replace("Lösung:", "")
                lsg = eval(lsg)

                # z.B. bei Ausgabe mehrere Arrays (s. v8 Test 2)
                try:
                    score = get_score(asg, lsg)
                except:
                    score = 0

                scores.append(score)

        sum = 0
        for score in scores:
            sum += score
        end_score = round(sum / len(scores), 2)
        with open("result/results.txt", "a", encoding="utf-8") as datei:
            datei.write(f"{test.replace('tests/neu/test_result', 'model').replace('.txt', '')}:\n")
            datei.write(f"Scores: {scores}\n")
            datei.write(f"End Score: {end_score}\n\n")


def get_score(asg, lsg):
    """
    Berechnet den Score zwischen zwei Schnittlisten.
    asg: AI Schnitte (ausgabe)
    lsg: Lösungsschnitte (lösung)
    """
    overlaps = []
    # Vergleicht alle Schnitte miteinander
    for a_start, a_end in asg:
        for l_start, l_end in lsg:
            # overlap => Intervall in dem beide Bereiche "aktiv" sind
            start = max(a_start, l_start)
            end = min(a_end, l_end)
            if start < end:
                overlaps.append((start, end))

    overlaps_total = sum(end - start for start, end in overlaps)
    asg_total = sum(end - start for start, end in asg)
    lsg_total = sum(end - start for start, end in lsg)

    # overlap / Gesamtbereich beider Schnitte
    end_score = overlaps_total / (asg_total + lsg_total - overlaps_total) * 100

    return round(end_score, 3)


if __name__ == "__main__":
    main()