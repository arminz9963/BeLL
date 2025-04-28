#import os
#import tempfile
from flask import Flask, render_template, request, jsonify
#from logic import convert_mp4_to_mp3, transcribe_audio

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, port=5002)