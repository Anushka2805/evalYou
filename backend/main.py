import os
import uuid
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from config import UPLOAD_DIR
from crud import create_interview, get_interview, get_all_interviews

from whisper_utils import transcribe_audio
from voice_metrics import compute_voice_metrics
from audio_utils import extract_audio, get_audio_duration_sec
from answer_metrics import compute_answer_metrics
from body_metrics import analyze_body

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
    body = analyze_body(video_path)

    interview["body_metrics"] = body

    # 1) Extract audio
    extract_audio(video_path, wav_path)

    # 2) Transcribe with Whisper
    transcript = transcribe_audio(wav_path)

    # 3) Duration
    duration_sec = get_audio_duration_sec(wav_path)

    # 4) Voice metrics
    voice = compute_voice_metrics(transcript, duration_sec)
    question_text = "Can you explain the concept of object-oriented programming and how it differs from procedural programming?"
    answer = transcript or ""
    answer_metrics = compute_answer_metrics(question_text, answer, voice["fillers"])

    # 5) Keep your (temporary) scores
    fake_scores = {
        "overall": 78,
        "confidence": voice["confidence"],
        "communication": 80,
        "body": 72,
        "content": int(round((answer_metrics["relevance"] + answer_metrics["clarity"] + answer_metrics["structure"] + answer_metrics["completeness"]) / 4)),
    }

    interview["scores"] = fake_scores
    interview["transcript"] = transcript
    interview["voice_metrics"] = voice
    interview["answer_metrics"] = answer_metrics

    return {
        "id": interview_id,
        "scores": fake_scores,
        "transcript": transcript,
        "voice_metrics": voice,
        "answer_metrics": answer_metrics,
        "body_metrics": body,
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