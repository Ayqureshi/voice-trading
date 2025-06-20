from fastapi import FastAPI
from audio.stream_scraper import get_stream_url
from audio.recorder import record_audio
from audio.whisper_runner import transcribe_audio

app = FastAPI()

@app.get("/stream")
def get_transcription():
    stream_url = get_stream_url()
    record_audio(stream_url)
    result = transcribe_audio("data/output.wav")
    return {"transcription": result}
