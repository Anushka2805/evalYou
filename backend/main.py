import os
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from config import UPLOAD_DIR
from crud import create_interview, get_interview, get_all_interviews

from audio_utils import extract_audio
from whisper_utils import transcribe_audio

app = FastAPI()

# CORS (allow frontend)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads folder exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.get("/")
def root():
    return {"status": "EvalYou backend running"}

# Upload video
@app.post("/upload")
async def upload_video(file: UploadFile = File(...)):
    interview_id = str(uuid.uuid4())
    filename = f"{interview_id}.webm"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    data = {
        "id": interview_id,
        "title": "Mock Interview",
        "date": "2026-02-23",
        "role": "Software Engineer",
        "mode": "Neutral",
        "difficulty": "Medium",
        "video_path": filepath,
        "scores": {},
        "transcript": "",
    }

    interview = create_interview(data)

    return {
        "message": "Video uploaded",
        "interview_id": interview_id,
        "interview": interview,
    }

# Analyze: extract audio -> whisper -> fake scores
@app.post("/analyze/{interview_id}")
def analyze(interview_id: str):
    interview = get_interview(interview_id)
    if not interview:
        return {"error": "Interview not found"}

    video_path = interview["video_path"]
    wav_path = video_path.replace(".webm", ".wav")

    # 1) Extract audio
    extract_audio(video_path, wav_path)

    # 2) Transcribe with Whisper
    transcript = transcribe_audio(wav_path)

    # 3) Fake scores for now (next step we’ll compute real metrics)
    fake_scores = {
        "overall": 78,
        "confidence": 75,
        "communication": 80,
        "body": 72,
        "content": 82,
    }

    interview["scores"] = fake_scores
    interview["transcript"] = transcript

    return {
        "id": interview_id,
        "scores": fake_scores,
        "transcript": transcript,
    }

# Get single interview
@app.get("/results/{interview_id}")
def get_results(interview_id: str):
    interview = get_interview(interview_id)
    if not interview:
        return {"error": "Not found"}
    return interview

# Get all interviews
@app.get("/interviews")
def list_interviews():
    return get_all_interviews()