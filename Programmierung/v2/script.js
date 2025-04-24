const videoInput = document.getElementById('VideoInput');
const videoPlayer = document.getElementById('VideoPlayer');
const videoInputLabel = document.getElementById('VideoInputLabel');
const restContainer = document.getElementById('restContainer');
const geschnittenesVideoPlayBtn = document.getElementById('geschnittenesVideoPlayBtn');
let Schnitte = []; // Array für die Schnitte
let duration = 0; // Variable für die Dauer des Videos


videoInput.addEventListener('loadedmetadata', function () {
    duration = videoPlayer.duration; // Dauer des Videos wird gespeichert
    console.log("Dauer des Videos:", duration); // Dauer des Videos wird in der Konsole ausgegeben
});

videoInput.addEventListener('change', function () {
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
    <input type="range" class="startRange" min="0" step="0.01" style="width: 40%" value="0"/>
    <input type="range" class="endRange" min="0" step="0.01" style="width: 40%" value="0"/>
    <br/>
    <span>Start: <input type="text" class="startInput" maxlength="8" value="00:00.00" /></span>
    <span style="margin-left: 20px">Ende: <input type="text" class="endInput" maxlength="8" value="00:00.00" /></span>
    <br/><br/>
  `;

    SchnittContainer.append(cutSection); // Fügt den neuen Schnitt-Container hinzu



    const startRange = cutSection.querySelector('.startRange');
    const endRange = cutSection.querySelector('.endRange');
    const startInput = cutSection.querySelector('.startInput');
    const endInput = cutSection.querySelector('.endInput');

    startRange.max = videoPlayer.duration;
    endRange.max = videoPlayer.duration;

    // Start-Slider Event
    startRange.addEventListener("input", function () {
        if (parseFloat(startRange.value) >= parseFloat(endRange.value)) {
            startRange.value = parseFloat(endRange.value) - 0.01;
        }
        startInput.value = formatTime(startRange.value);
    });

    // End-Slider Event
    endRange.addEventListener("input", function () {
        if (parseFloat(endRange.value) <= parseFloat(startRange.value)) {
            endRange.value = parseFloat(startRange.value) + 0.01;
        }
        endInput.value = formatTime(endRange.value);
    });

    // Start-Eingabe Event
    startInput.addEventListener("blur", function () {
        const seconds = parseTime(startInput.value);
        if (seconds >= parseFloat(endRange.value)) {
            startRange.value = parseFloat(endRange.value) - 0.01;
        } else {
            startRange.value = seconds;
        }
    });

    // End-Eingabe Event
    endInput.addEventListener("blur", function () {
        const seconds = parseTime(endInput.value);
        if (seconds <= parseFloat(startRange.value)) {
            endRange.value = parseFloat(startRange.value) + 0.01;
        } else {
            endRange.value = seconds;
        }
    });



});

videoPlayer.addEventListener('loadedmetadata', function () {

});

geschnittenesVideoPlayBtn.addEventListener('click', function () {
    Schnitte = [[19.1, 19.2], [25.1, 25.2], [34.5, 34.6], [5.2, 6.7], [340.9, 342.1]]; // Beispiel Schnitte

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



// ==================== Funktionen ==================== //


// Diese Funktion aktualisiert die angezeigten Zeiten für Start und Ende des Schnitts
function updateTrimTimes() {
    startInput.value = formatTime(startTrim); // Das Startzeitfeld wird formatiert und aktualisiert
    endInput.value = formatTime(endTrim); // Das Endzeitfeld wird formatiert und aktualisiert
    totalDuration.textContent = formatTime(endTrim - startTrim); // Die Gesamtdauer des Schnitts wird aktualisiert
}

// Diese Funktion formatiert eine Zeit (in Sekunden) in das Format MM:SS:MS
function formatTime(seconds) {
    const min = Math.floor(seconds / 60); // Minuten berechnen
    const sec = Math.floor(seconds % 60); // Sekunden berechnen
    const ms = Math.floor((seconds % 1) * 100); // Millisekunden berechnen
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`; // Zeit im Format MM:SS.ms zurückgeben
}

// Diese Funktion verarbeitet die Eingabewerte und aktualisiert den Start- oder Endzeitpunkt
function updateTimeFromInput(input, type) {
    let value = input.value; // Der Wert aus dem Eingabefeld wird gespeichert
    value = value.replace(/[^0-9:.]/g, ""); // Ungültige Zeichen werden entfernt

    const parts = value.split(":"); // Der Wert wird in Minuten, Sekunden und Millisekunden unterteilt
    let minutes = "00";
    let seconds = "00";
    let milliseconds = "00";

    if (parts[0]) minutes = parts[0].padStart(2, "0"); // Minuten werden gesetzt
    if (parts[1]) {
        let secondParts = parts[1].split(".");
        seconds = secondParts[0].padStart(2, "0"); // Sekunden werden gesetzt
        if (secondParts[1]) milliseconds = secondParts[1].padEnd(2, "0"); // Millisekunden werden gesetzt
    }

    if (parseInt(seconds) > 59) seconds = "59"; // Wenn die Sekunden größer als 59 sind, werden sie auf 59 gesetzt
    if (parseInt(minutes) > 59) minutes = "59"; // Wenn die Minuten größer als 59 sind, werden sie auf 59 gesetzt

    const formattedTime = `${minutes}:${seconds}.${milliseconds}`; // Formatierte Zeit wird zusammengesetzt
    input.value = formattedTime; // Das Eingabefeld wird mit der formatierten Zeit aktualisiert

    let totalSeconds = parseInt(minutes) * 60 + parseInt(seconds) + parseInt(milliseconds) / 100; // Gesamte Zeit in Sekunden berechnen

    if (type === "start") {
        startTrim = Math.min(totalSeconds, videoPlayer.duration); // Der Startzeitpunkt wird aktualisiert
    } else {
        endTrim = Math.min(totalSeconds, videoPlayer.duration); // Der Endzeitpunkt wird aktualisiert
    }

    if (startTrim >= endTrim) {
        startTrim = endTrim - 0.01; // Sicherstellen, dass der Startzeitpunkt vor dem Endzeitpunkt bleibt
    }

    startRange.value = startTrim; // Der Wert des Start-Schiebereglers wird aktualisiert
    endRange.value = endTrim; // Der Wert des End-Schiebereglers wird aktualisiert
    updateTrimTimes(); // Die angezeigten Zeiten werden aktualisiert
}

// Diese Funktion formatiert die Zeitstempel in Stunden:Minuten:Sekunden.Millisekunden
function formatTimestamp(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = (seconds % 60).toFixed(2);
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(5, "0")}`;
}