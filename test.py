def berechne_score(schnitt, referenz):
    s1, s2 = schnitt
    r1, r2 = referenz

    # Case 1: kein overlap links
    if s2 <= r1:
        return 0, "Case 1: Schnitt komplett links"

    # Case 2: kein overlap rechts
    if s1 >= r2:
        return 0, "Case 2: Schnitt komplett rechts"

    # Case 3: Schnitt ist genau innerhalb Referenz
    if s1 >= r1 and s2 <= r2:
        return s2 - s1, "Case 3: Schnitt innerhalb Referenz"

    # Case 4: Schnitt deckt Referenz komplett ab
    if s1 <= r1 and s2 >= r2:
        return r2 - r1, "Case 4: Referenz komplett abgedeckt"

    # Case 5: Schnitt startet vor Referenz und endet in ihr
    if s1 < r1 and s2 > r1 and s2 < r2:
        return s2 - r1, "Case 5: Überlappt links teilweise"

    # Case 6: Schnitt startet in Referenz und geht über sie hinaus
    if s1 > r1 and s1 < r2 and s2 > r2:
        return r2 - s1, "Case 6: Überlappt rechts teilweise"

    # Case 7: Schnitt startet vor Referenz und endet genau am Ende
    if s1 < r1 and s2 == r2:
        return r2 - r1, "Case 7: Links länger, endet gleich"

    # Case 8: Schnitt startet genau am Anfang und geht drüber hinaus
    if s1 == r1 and s2 > r2:
        return r2 - r1, "Case 8: Rechts länger, startet gleich"

    return 0, "Nicht abgedeckter Sonderfall"


# -----------------------------
# Beispiele für alle 8 Cases
# -----------------------------
referenz = (20, 60)
tests = {
    "Case 1": (5, 15),
    "Case 2": (70, 80),
    "Case 3": (30, 40),
    "Case 4": (10, 70),
    "Case 5": (10, 40),
    "Case 6": (40, 70),
    "Case 7": (10, 60),
    "Case 8": (20, 70)
}

for name, schnitt in tests.items():
    score, text = berechne_score(schnitt, referenz)
    print(f"{name} → Schnitt {schnitt}, Score = {score}, {text}")
