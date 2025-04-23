const VideoInput = document.getElementById('VideoInput');
const VideoPlayer = document.getElementById('VideoPlayer');
const VideoInputLabel = document.getElementById('VideoInputLabel');
const restContainer = document.getElementById('restContainer');

VideoInput.addEventListener('change', function () {
    const file = this.files[0];
    if (file) { // Überprüfen, ob eine Datei ausgewählt wurde
        const url = URL.createObjectURL(file); // Erstellt temporäre URL fürs Video
        VideoPlayer.src = url;
        VideoPlayer.load();
        VideoPlayer.play();
    }

    VideoInput.style.display = "none"; // Versteckt den Datei-Input nach Auswahl
    VideoPlayer.style.display = "block"; // Zeigt den Video-Player an
    VideoInputLabel.style.display = "none"; // Versteckt das Label
    restContainer.style.display = "block"; // Zeigt den Rest-Container an
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
    <br />
    <span>Start: <input type="text" class="startInput" maxlength="8" value="00:00.00" /></span>
    <span style="margin-left: 20px">Ende: <input type="text" class="endInput" maxlength="8" value="00:00.00" /></span>
    <br /><br />
  `;

    SchnittContainer.append(cutSection); // Fügt den neuen Schnitt-Container hinzu


});