import whisper

def transcribe_audio(audio_path: str) -> str:
    try:
        # Load Whisper model (you can use "base", "small", "medium", or "large")
        model = whisper.load_model("base")

        # Transcribe the audio file
        result = model.transcribe(audio_path)

        # Return the transcription text
        return result["text"]

    except Exception as e:
        return f"Error transcribing audio: {e}"
