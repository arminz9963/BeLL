const videoInput = document.getElementById("VideoInput");
const videoPlayer = document.getElementById("VideoPlayer");
const videoInputLabel = document.getElementById("VideoInputLabel");
const restContainer = document.getElementById("restContainer");
const geschnittenesVideoPlayBtn = document.getElementById("geschnittenesVideoPlayBtn");
const absendeBtn = document.getElementById("AbsendeBtn");
const DauerAnzeige = document.getElementById("dauerGeschnittenesVideo");
const VideoContainer = document.getElementById("VideoContainer");
let Schnitte = []; // Array für die Schnitte
let transkript = null;

videoPlayer.addEventListener("loadeddata", function () {
    const duration = videoPlayer.duration; // Dauer des Videos wird gespeichert
    console.log("Dauer des Videos:", duration); // Dauer des Videos wird in der Konsole ausgegeben

    // Transkription
    const formData = new FormData(); // Ein neues FormData-Objekt wird erstellt
    formData.append("video", videoInput.files[0]); // Die Videodatei wird zum FormData hinzugefügt
    // Eine POST-Anfrage wird an den Server gesendet, um die Transkription zu erhalten
    fetch("/upload", {
        method: "POST",
        body: formData, // Die Formulardaten (Video) wird gesendet
    })
        .then((response) => response.json()) // Antwort wird als JSON geparsed
        .then(data => {
            transkript = data

            console.log("Transkription:", transkript); // Transkription wird in der Konsole ausgegeben
        })
        .catch((error) => {
            console.error("Fehler bei der Transkription:", error);
            popup("Es gab ein Fehler bei der Transkription: " + error.message + "\n Versuche es bitte später erneut."); // Popup anzeigen
        }) // Fehlerbehandlung
});

videoInput.addEventListener("change", function () {
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
    geschnittenesVideoPlayBtn.style.display = "flex"; // Zeigt den Play-Button für das geschnittene Video
    DauerAnzeige.style.display = "block"; // Zeigt die Dauer-Anzeige an
});

const addNewCutBtn = document.getElementById("addNewCutBtn");
let cutSectionCount = 0
const SchnittContainer = document.getElementById("SchnittContainer");

addNewCutBtn.addEventListener("click", function () {
    cutSectionCount++;
    Schnitte.push([0, videoPlayer.duration]);

    const cutSection = document.createElement("div");
    cutSection.className = "cutSection bg-dark-700 rounded-lg p-4 mb-4";
    cutSection.id = `Schnitt${cutSectionCount}`;

    cutSection.innerHTML = `
    <div class="flex justify-between items-center mb-3">
        <h3 class="text-lg font-medium">Schnitt ${cutSectionCount}</h3>
        <button class="deleteCutBtn bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition" style="margin-right: 20px">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
        </button>
    </div>
    <div class="space-y-4">
        <div>
        <label class="block text-sm text-gray-400 mb-1">Startzeit</label>
        <div class="flex items-center gap-4">
            <input type="range" class="startRange w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" min="0" step="0.01" value="0"/>
            <input type="text" class="startInput bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-24 text-center" maxlength="8" value="00:00.00" />
        </div>
        </div>
        <div>
        <label class="block text-sm text-gray-400 mb-1">Endzeit</label>
        <div class="flex items-center gap-4">
            <input type="range" class="endRange w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer" min="0" step="0.01" value="0"/>
            <input type="text" class="endInput bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white w-24 text-center" maxlength="8" value="00:00.01" />
        </div>
        </div>
    </div>
    `;

    SchnittContainer.append(cutSection);




    const startRange = cutSection.querySelector(".startRange");
    const endRange = cutSection.querySelector(".endRange");
    const startInput = cutSection.querySelector(".startInput");
    const endInput = cutSection.querySelector(".endInput");
    const deleteCutBtn = cutSection.querySelector(".deleteCutBtn");

    startRange.dataset.index = cutSectionCount - 1;
    endRange.dataset.index = cutSectionCount - 1;
    startInput.dataset.index = cutSectionCount - 1;
    endInput.dataset.index = cutSectionCount - 1;
    deleteCutBtn.dataset.index = cutSectionCount - 1;


    // Trimm-Variablen einstellen
    startRange.min = 0; // StartRange Schieberegler Minimum auf 0 setzen
    startRange.max = videoPlayer.duration - 0.01;
    startRange.value = 0; // setzt StartRange Schieberegler am Anfang auf 0
    endRange.min = 0.01; // EndRange Schieberegler Minimum auf 0 setzen
    endRange.max = videoPlayer.duration;
    endRange.value = videoPlayer.duration; // setzt EndRange Schieberegler am Anfang auf max Dauer
    endInput.value = formatTime(endRange.value); // setzt EndInput am Anfang auf max Dauer
    startInput.value = formatTime(startRange.value); // setzt StartInput am Anfang auf 0

    // Start-Slider Event
    startRange.addEventListener("input", function () {
        if (parseFloat(startRange.value) >= parseFloat(endRange.value)) {
            startRange.value = parseFloat(endRange.value) - 0.01;
        }
        startInput.value = formatTime(startRange.value);
        Schnitte[startRange.dataset.index][0] = parseFloat(startRange.value); // Speichert den Startzeitpunkt im Schnitte-Array
    });

    // End-Slider Event
    endRange.addEventListener("input", function () {
        if (parseFloat(endRange.value) <= parseFloat(startRange.value)) {
            endRange.value = parseFloat(startRange.value) + 0.01;
        }
        endInput.value = formatTime(endRange.value);
        Schnitte[endRange.dataset.index][1] = parseFloat(endRange.value); // Speichert den Endzeitpunkt im Schnitte-Array
    });

    // Start-Eingabe Event
    startInput.addEventListener("blur", function () {
        console.log("Start-Eingabe:", startInput.value); // Debugging-Ausgabe
        const time = checkTimeFromInput(startInput.value);
        startInput.value = time;
        console.log("Start-Eingabe:", time); // Debugging-Ausgabe
        if (formatTimeToSeconds(time) >= parseFloat(endRange.value)) {
            startInput.value = formatTime(parseFloat(endRange.value) - 0.01); // Wenn Startzeitpunkt >= Endzeitpunkt, wird Startzeitpunkt auf Endzeitpunkt - 0.01 gesetzt
        }
        startRange.value = formatTimeToSeconds(time);
        Schnitte[startInput.dataset.index][0] = parseFloat(startRange.value); // Speichert den Startzeitpunkt im Schnitte-Array
    });

    // End-Eingabe Event
    endInput.addEventListener("blur", function () {
        console.log("End-Eingabe:", endInput.value); // Debugging-Ausgabe
        const time = checkTimeFromInput(endInput.value);
        endInput.value = time;
        if (formatTimeToSeconds(time) <= parseFloat(startRange.value)) {
            endInput.value = formatTime(parseFloat(startRange.value) + 0.01); // Wenn Endzeitpunkt <= Startzeitpunkt, wird Endzeitpunkt auf Startzeitpunkt + 0.01 gesetzt
        }
        console.log("End-Eingabe:", time); // Debugging-Ausgabe
        endRange.value = formatTimeToSeconds(time);
        Schnitte[endInput.dataset.index][1] = parseFloat(endRange.value); // Speichert den Endzeitpunkt im Schnitte-Array
    });

    deleteCutBtn.addEventListener("click", function () {
        Schnitte.splice(deleteCutBtn.dataset.index, 1); // Entfernt den Schnitt aus dem Array
        SchnittContainer.removeChild(cutSection); // Entfernt den Schnitt-Container aus dem DOM
        cutSectionCount--; // Verringert den Zähler für die Schnitte
        console.log("Schnitte nach Löschen:", Schnitte); // Debugging-Ausgabe

        const allCutSections = SchnittContainer.querySelectorAll(".cutSection");
        allCutSections.forEach((section, newIndex) => {
            section.id = `Schnitt${newIndex + 1}`;
            section.querySelector("h3").innerText = `Schnitt ${newIndex + 1}`;

            // Alle Controls neu zuordnen
            section.querySelector(".startRange").dataset.index = newIndex;
            section.querySelector(".endRange").dataset.index = newIndex;
            section.querySelector(".startInput").dataset.index = newIndex;
            section.querySelector(".endInput").dataset.index = newIndex;
            section.querySelector(".deleteCutBtn").dataset.index = newIndex;
        });
    });



});


geschnittenesVideoPlayBtn.addEventListener("click", function () {

    console.log("Schnitte:", Schnitte); // Debugging-Ausgabe

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
    videoPlayer.removeEventListener("timeupdate", onTimeUpdate);
    videoPlayer.addEventListener("timeupdate", onTimeUpdate);

    // Direkt loslegen: Zum ersten Schnitt springen und Video starten
    springenZumSchnitt(i);

    // Dauer des geschnittenen Videos berechnen
    let geschnitteneDauer = 0;
    Schnitte.forEach((schnitt) => {
        geschnitteneDauer += schnitt[1] - schnitt[0]; // Dauer jedes Schnitts addieren
    });
    DauerAnzeige.innerText = `Dauer geschnittenes Video: ${formatTime(geschnitteneDauer)}`;
});

absendeBtn.addEventListener("click", function () {
    const BeschreibungDiv = document.getElementsByClassName("Beschreibung")[0];
    const BeschreibungInput = document.getElementById("BeschreibungInput");

    // Vorher erstellen, damit wir später drauf zugreifen können
    let warnParagraph = document.getElementById("warnParagraph1");
    let warnParagraph2 = document.getElementById("warnParagraph2");

    // Wenn schon existiert, vorher löschen (damit sie nicht doppelt erscheinen)
    if (warnParagraph) {
        BeschreibungDiv.removeChild(warnParagraph);
    }
    if (warnParagraph2) {
        BeschreibungDiv.removeChild(warnParagraph2);
    }

    if (cutSectionCount < 1) {
        warnParagraph = document.createElement("p");
        warnParagraph.id = "warnParagraph1"; // ID geben zum Wiederfinden
        warnParagraph.textContent = "Bitte füge einen Schnitt hinzu!";
        BeschreibungDiv.appendChild(warnParagraph);
    }

    if (BeschreibungInput.value.trim() === "") {
        warnParagraph2 = document.createElement("p");
        warnParagraph2.id = "warnParagraph2"; // ID für zweiten Warntext
        warnParagraph2.textContent = "Bitte füge eine Beschreibung hinzu!";
        BeschreibungDiv.appendChild(warnParagraph2);
    }

    // Prüfen ob Transkript überhaupt vorhanden ist
    if (!transkript) {
        console.log("Noch kein Transkript vorhanden!");
        popup("Die Transkription ist noch nicht abgeschlossen – bitte habe einen Moment Geduld und versuche es anschließend erneut."); // Popup anzeigen
        return; // Abbrechen
    }

    console.log(transkript)
    // Daten senden, wenn Beschreibung und mindestens ein Schnitt vorhanden ist
    if (cutSectionCount >= 1 && BeschreibungInput.value.trim() !== "") {
        // Hier muss der Code für das Senden der Daten hin ans Backend
        daten = {
            transkript: transkript,
            schnitte: Schnitte,
            beschreibung: BeschreibungInput.value
        };
        console.log("Daten, die gesendet werden:", daten); // Debugging-Ausgabe

        fetch("/daten_senden", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(daten)
        })
            .then(() => {
                console.log("Daten erfolgreich gesendet");
                popup("Das Video wurde erfolgreich gesendet!"); // Popup anzeigen
                resetLayout(); // Layout zurücksetzen
            })
            .catch((error) => {
                console.error("Fehler bei der Transkription:", error);

            }) // Fehlerbehandlung
    }

});


// ==================== Funktionen ==================== //

function formatTime(seconds) {
    /* Konvertiert Sekunden in das Format MM:SS.mm */
    const min = Math.floor(seconds / 60); // Minuten berechnen
    const sec = Math.floor(seconds % 60); // Sekunden berechnen
    const ms = Math.floor((seconds % 1) * 100); // Millisekunden berechnen
    return `${String(min).padStart(2, "0")}:${String(sec).padStart(2, "0")}.${String(ms).padStart(2, "0")}`; // Zeit im Format MM:SS.ms zurückgeben
}

function formatTimeToSeconds(timeString) {
    /* Konvertiert eine Zeit im Format MM:SS.mm in Sekunden */
    const parts = timeString.split(/[:.]/); // Teilt den String in Minuten, Sekunden und Millisekunden
    const minutes = parseInt(parts[0], 10); // Minuten
    const seconds = parseInt(parts[1], 10); // Sekunden
    const milliseconds = parseInt(parts[2], 10); // Millisekunden
    return minutes * 60 + seconds + milliseconds / 100; // Gesamtzeit in Sekunden zurückgeben
}

function checkTimeFromInput(inputString) {
    /* Checkt den Input des Users, wenn dieser dem Fromat nicht enstpricht wird die Zeit zurück auf 00:00.00 gesetzt */
    const regex = /^([0-9]{1,2}):([0-5][0-9])\.(\d{2})$/; // Regex für das Format MM:SS.ms
    if (regex.test(inputString)) {
        if (formatTimeToSeconds(inputString) > videoPlayer.duration) {
            return "00:00.00" // Wenn die Zeit größer als die Videolänge ist, wird Zeit zurückgesetzt
        }
        else {
            return inputString; // Wenn das Format korrekt ist, gib den Wert zurück
        }
    }
    else {
        return "00:00.00"
    }
}

function resetLayout() {
    /* Setzt das Layout zurück, nachdem die Daten gesendet wurden */
    videoInput.style.display = "none"; // Zeigt den Datei-Input wieder an
    videoPlayer.style.display = "none"; // Versteckt den Video-Player
    videoInputLabel.style.display = "flex"; // Zeigt das Label wieder an
    restContainer.style.display = "none"; // Versteckt den Rest-Container
    geschnittenesVideoPlayBtn.style.display = "none"; // Versteckt den Play-Button für das geschnittene Video
    DauerAnzeige.style.display = "none"; // Versteckt die Dauer-Anzeige

    videoPlayer.src = ""; // Setzt die Video-Quelle zurück
    videoPlayer.currentTime = 0; // Setzt die aktuelle Zeit des Videos auf 0

    BeschreibungInput.value = ""; // Leert das Beschreibungseingabefeld
    // Alle Schnitte entfernen
    SchnittContainer.innerHTML = "";
    Schnitte = []; // Leert das Schnitte-Array
    cutSectionCount = 0; // Setzt den Schnitt-Zähler zurück
}


function popup(text) {
    /* Erstellt ein Popup-Fenster mit dem angegebenen Text und einem OK-Button */

    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50";

    const popup = document.createElement("div");
    popup.className = "bg-gray-800 rounded-xl p-6 max-w-md w-full shadow-2xl";

    const message = document.createElement("p");
    message.className = "text-white mb-4 text-center";
    message.textContent = text;

    const okButton = document.createElement("button");
    okButton.className = "w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition mt-4";
    okButton.textContent = "OK";

    okButton.onclick = () => {
        document.body.removeChild(overlay);
    };

    popup.appendChild(message);
    popup.appendChild(okButton);
    overlay.appendChild(popup);
    document.body.appendChild(overlay);
}
