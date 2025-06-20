import subprocess

def record_audio(url, duration=30):
    output = "data/output.wav"
    cmd = [
        "ffmpeg", "-y", "-i", url,
        "-t", str(duration),
        "-ac", "1", "-ar", "16000",
        "-f", "wav", output
    ]
    subprocess.run(cmd, check=True)
