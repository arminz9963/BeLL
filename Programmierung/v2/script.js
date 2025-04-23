const videoInput = document.getElementById('VideoInput');
const videoPlayer = document.getElementById('VideoPlayer');
const videoInputLabel = document.getElementById('VideoInputLabel');
const restContainer = document.getElementById('restContainer');
const geschnittenesVideoPlayBtn = document.getElementById('geschnittenesVideoPlayBtn');
let Schnitte = []; // Array für die Schnitte


VideoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) { // Überprüfen, ob eine Datei ausgewählt wurde
        const url = URL.createObjectURL(file); // Erstellt temporäre URL fürs Video
        videoPlayer.src = url;
        videoPlayer.load();
    }

    videoInput.style.display = "none"; // Versteckt den Datei-Input nach Auswahl
    videoPlayer.style.display = "block"; // Zeigt den Video-Player an
    videoInputLabel.style.display = "none"; // Versteckt das Label
    restContainer.style.display = "block"; // Zeigt den Rest-Container an
    geschnittenesVideoPlayBtn.style.display = "block"; // Zeigt den Play-Button für das geschnittene Video
});

const addNewCutBtn = document.getElementById('addNewCutBtn');
let cutSectionCount = 0
const SchnittContainer = document.getElementById('SchnittContainer');

addNewCutBtn.addEventListener('click', function () {
    cutSectionCount++; // Erhöht den Zähler für die Schnitte

    const cutSection = document.createElement('div');
    cutSection.id = `Schnitt${cutSectionCount}`; // Setzt die ID für den neuen Schnitt-Container
    cutSection.innerHTML = `
    <h3>Schnitt ${cutSectionCount}</h3>
    <button class="deleteCutBtn" style="margin-right: 20px">X</button>
    <label>Trimmen:</label>
    <input type="range" class="startRange" min="0" step="0.01" style="width: 40%" value="0"/>
    <input type="range" class="endRange" min="0" step="0.01" style="width: 40%" value="0"/>
    <br/>
    <span>Start: <input type="text" class="startInput" maxlength="8" value="00:00.00" /></span>
    <span style="margin-left: 20px">Ende: <input type="text" class="endInput" maxlength="8" value="00:00.00" /></span>
    <br/><br/>
  `;

    SchnittContainer.append(cutSection); // Fügt den neuen Schnitt-Container hinzu


});

videoPlayer.addEventListener('loadedmetadata', function () {
    const duration = videoPlayer.duration; // Holt die Gesamtdauer des Videos
    console.log("Dauer: " + duration); // Gibt die Dauer in der Konsole aus
    const MinTime = 0
});

geschnittenesVideoPlayBtn.addEventListener('click', function () {
    Schnitte = [[19.1, 19.2], [25.1, 25.2], [34.5, 34.6]]; // Beispiel Schnitte

    let i = 0; // Index des aktuellen Schnitts, wir starten bei 0

    // Funktion zum Springen zu einem bestimmten Schnittbereich
    function springenZumSchnitt(index) {
        // Wenn der Index noch innerhalb der Schnitte liegt
        if (index < Schnitte.length) {
            videoPlayer.currentTime = Schnitte[index][0]; // Springe zum Startzeitpunkt des Schnitts
            videoPlayer.play(); // Starte das Video
        } else {
            videoPlayer.pause(); // Wenn kein Schnitt mehr übrig ist → Video stoppen
        }
    }

    // Funktion wird bei jedem Zeitupdate des Videos aufgerufen
    function onTimeUpdate() {
        if (i >= Schnitte.length) return; // Wenn alle Schnitte durch sind → nichts tun

        const [start, end] = Schnitte[i]; // Aktuellen Schnitt holen

        if (videoPlayer.currentTime >= end) { // Wenn das Video den Endzeitpunkt erreicht hat
            i++; // Nächsten Schnittindex setzen
            springenZumSchnitt(i); // Zum nächsten Schnitt springen
        }
    }

    // Ganz wichtig: Den EventListener zuerst entfernen,
    // falls man den Button mehrmals klickt – sonst mehrfacher Aufruf!
    videoPlayer.removeEventListener('timeupdate', onTimeUpdate);
    videoPlayer.addEventListener('timeupdate', onTimeUpdate);

    // Direkt loslegen: Zum ersten Schnitt springen und Video starten
    springenZumSchnitt(i);
});