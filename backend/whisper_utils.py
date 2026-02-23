from faster_whisper import WhisperModel

# Load model once (small = fast on CPU)
model = WhisperModel("small", device="cpu", compute_type="int8")

def transcribe_audio(wav_path: str) -> str:
    segments, info = model.transcribe(wav_path)
    text = []
    for segment in segments:
        text.append(segment.text)
    return " ".join(text).strip()