from flask import Flask, render_template, request, jsonify, send_from_directory
import os
import shutil
import uuid
import openai
import whisper

from config import OPENAI_API_KEY

app = Flask(__name__)

openai.api_key = OPENAI_API_KEY

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_audio():
    audio_file = request.files['audio']
    recording_id = str(uuid.uuid4())  # Generate a unique ID for the recording
    audio_filename = os.path.join(UPLOAD_FOLDER, f"{recording_id}.wav")
    audio_file.save(audio_filename)
    return jsonify({
        "success": True,
        "id": recording_id
    })

@app.route('/rename/<string:recording_id>', methods=['POST'])
def rename_recording(recording_id):
    new_name = request.json['newName']
    old_path = os.path.join(UPLOAD_FOLDER, f"{recording_id}.wav")
    new_path = os.path.join(UPLOAD_FOLDER, f"{new_name}.wav")
    os.rename(old_path, new_path)
    return jsonify({
        "success": True,
        "message": "Recording renamed successfully!"
    })

@app.route('/getRecordings', methods=['GET'])
def get_recordings():
    recordings = []
    for filename in os.listdir(UPLOAD_FOLDER):
        if filename != ".DS_Store":  # Exclude .DS_Store from the list
            filepath = os.path.join(UPLOAD_FOLDER, filename)
            recordings.append({
                "name": filename.split('.')[0],
                "url": filepath
            })
    return jsonify({
        "recordings": recordings
    })

@app.route('/uploads/<string:filename>', methods=['GET'])
def serve_recording(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/analyze/<string:recordingName>', methods=['GET'])
def analyze(recordingName):
    filepath = os.path.join(UPLOAD_FOLDER, f"{recordingName}.wav")
    
    # Step 1: Send the audio file to Whisper API for transcription
    transcription = send_to_whisper(filepath)
    print(transcription)
    # Step 2: Use GPT-4 (or similar model) to analyze the transcription
    analysis = analyze_with_gpt4(transcription)
    
    return jsonify({
        "success": True,
        "transcription": transcription,
        "analysis": analysis
    })

@app.route('/saveRecording', methods=['POST'])
def save_recording():
    audio_file = request.files['audio']
    filename = audio_file.filename
    filepath = os.path.join(UPLOAD_FOLDER, filename)

    if os.path.exists(filepath):
        return jsonify({"success": False, "message": "File with this name already exists!"})

    audio_file.save(filepath)
    return jsonify({"success": True})

def send_to_whisper(filepath):
    # Placeholder function: Interact with the Whisper API to get the transcription.
    # This will involve sending the audio file in 'filepath' to the Whisper API
    # and receiving the transcription in return.
    model = whisper.load_model("tiny.en")
    result = model.transcribe(filepath, initial_prompt = "Ummmm, yeah. Ah, yeah. Ahh. Uhh, yeah. Uhhh, I guess. Okay, ehm, uhhh, like, I guess")
    return result["text"]

system_prompt = """You are a speech evaluator. 
Provide feedback in second person on this on the following attributes: Clarity, Confidence, Fluency. 
Provide a counter for filler words if there are any. If the speech is already satisfactory on a specific metric - just say "Great job!". 
Begin the response by providing a score out of 100 with equal weights for all the metrics. 
Don't include any introduction or conclusion paragraphs."""
def analyze_with_gpt4(transcription):
    # Placeholder function: Send the transcription to GPT-4 or a similar model
    # and get an analysis or quality assessment of the transcription.
    response = openai.ChatCompletion.create(
        model="gpt-4",
        temperature=0.1,
        messages=[
            {
                "role": "system",
                "content": system_prompt
            },
            {
                "role": "user",
                "content": transcription
            }
        ]
    )
    return response['choices'][0]['message']['content']


@app.route('/delete/<string:recordingName>', methods=['DELETE'])
def delete_recording(recordingName):
    filepath = os.path.join(UPLOAD_FOLDER, f"{recordingName}.wav")
    
    try:
        os.remove(filepath)
        return jsonify({"success": True, "message": "Recording deleted successfully!"})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)})

@app.route('/deleteRecording/<string:name>', methods=['POST'])
def delete_specific_recording(name):
    """Delete a specific recording by name"""
    try:
        os.remove(os.path.join("uploads", name))
        return {"success": True}, 200
    except Exception as e:
        return {"success": False, "error": str(e)}, 500

@app.route('/deleteAllRecordings', methods=['POST'])
def delete_all_recordings():
    """Delete all recordings"""
    try:
        for filename in os.listdir("uploads"):
            file_path = os.path.join("uploads", filename)
            if os.path.isfile(file_path) or os.path.islink(file_path):
                os.unlink(file_path)
            elif os.path.isdir(file_path):
                shutil.rmtree(file_path)
        return {"success": True}, 200
    except Exception as e:
        return {"success": False, "error": str(e)}, 500


if __name__ == '__main__':
    app.run(debug=True)
