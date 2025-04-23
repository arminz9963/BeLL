const VideoInput = document.getElementById('VideoInput');
const VideoPlayer = document.getElementById('VideoPlayer');
const VideoInputLabel = document.getElementById('VideoInputLabel');

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
});