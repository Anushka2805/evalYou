import os
import uuid
from fastapi import FastAPI, UploadFile, File, Depends, Header, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from config import UPLOAD_DIR
import random
from repositories import create_interview, update_interview, get_interview, list_interviews_by_user
from users_repo import create_user, get_user_by_email, get_user_by_id
from auth import hash_password, verify_password, create_access_token, decode_token

from whisper_utils import transcribe_audio
from voice_metrics import compute_voice_metrics
from audio_utils import extract_audio, get_audio_duration_sec
from answer_metrics import compute_answer_metrics
from body_metrics import analyze_body

app = FastAPI()
# --------- Question Bank ---------

QUESTION_BANK = {

    "Software Engineer": {
        "Easy": [
            "Tell me about yourself.",
            "What is object oriented programming?",
            "Explain difference between stack and queue."
        ],
        "Medium": [
            "Explain REST APIs.",
            "What is database indexing?",
            "Describe a challenging bug you fixed."
        ],
        "Hard": [
            "Design a scalable URL shortener.",
            "Explain CAP theorem.",
            "How would you design a distributed cache?"
        ]
    },

    "Frontend Developer": {
        "Easy": [
            "What is semantic HTML?",
            "Difference between let, var and const?"
        ],
        "Medium": [
            "Explain React Virtual DOM.",
            "How does useEffect work?"
        ],
        "Hard": [
            "How would you optimize React performance?",
            "Explain SSR vs CSR."
        ]
    },

    "Backend Developer": {
        "Easy": [
            "What is an API?",
            "Difference between SQL and NoSQL?"
        ],
        "Medium": [
            "Explain microservices architecture.",
            "What is JWT authentication?"
        ],
        "Hard": [
            "Design a rate limiter.",
            "How would you scale backend to millions of users?"
        ]
    },

    "Data Analyst": {
        "Easy": [
            "What is data cleaning?",
            "Difference between mean and median?"
        ],
        "Medium": [
            "Explain SQL joins.",
            "What is hypothesis testing?"
        ],
        "Hard": [
            "How would you detect anomalies in data?",
            "Explain A/B testing."
        ]
    }
}

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

os.makedirs(UPLOAD_DIR, exist_ok=True)

# --------- Auth Helpers ---------

def get_current_user(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Not authenticated")

    token = authorization.split(" ")[1]
    payload = decode_token(token)
    if not payload or "user_id" not in payload:
        raise HTTPException(status_code=401, detail="Invalid token")

    user = get_user_by_id(payload["user_id"])
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user

# --------- Routes ---------

@app.get("/")
def root():
    return {"status": "EvalYou backend running"}

# --------- AUTH ---------

@app.post("/auth/signup")
def signup(data: dict):
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        raise HTTPException(status_code=400, detail="Email and password required")

    if get_user_by_email(email):
        raise HTTPException(status_code=400, detail="User already exists")

    user = {
        "id": str(uuid.uuid4()),
        "email": email,
        "password": hash_password(password),
    }

    create_user(user)

    token = create_access_token({"user_id": user["id"]})
    return {"token": token}

@app.post("/auth/login")
def login(data: dict):
    email = data.get("email")
    password = data.get("password")

    user = get_user_by_email(email)
    if not user or not verify_password(password, user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token = create_access_token({"user_id": user["id"]})
    return {"token": token}

# --------- Upload ---------

@app.post("/upload")
async def upload_video(
    file: UploadFile = File(...),
    role: str = File(...),
    mode: str = File(...),
    difficulty: str = File(...),
    question: str = File(...),
    user=Depends(get_current_user)
):
    interview_id = str(uuid.uuid4())
    filename = f"{interview_id}.webm"
    filepath = os.path.join(UPLOAD_DIR, filename)

    with open(filepath, "wb") as f:
        content = await file.read()
        f.write(content)

    doc = {
        "id": interview_id,
        "user_id": user["id"],
        "title": "Mock Interview",
        "date": "2026-02-23",
        "role": role,
        "mode": mode,
        "difficulty": difficulty,
        "question": question,
        "video_path": filepath,
        "scores": {},
        "transcript": "",
        "voice_metrics": {},
        "answer_metrics": {},
        "body_metrics": {},
    }

    create_interview(doc)

    return {"message": "Video uploaded", "interview_id": interview_id}

# --------- Analyze ---------

@app.post("/analyze/{interview_id}")
def analyze(interview_id: str, user=Depends(get_current_user)):
    interview = get_interview(interview_id)
    if not interview or interview["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Interview not found")

    video_path = interview["video_path"]
    wav_path = video_path.replace(".webm", ".wav")

    body = analyze_body(video_path)

    extract_audio(video_path, wav_path)
    transcript = transcribe_audio(wav_path)
    duration_sec = get_audio_duration_sec(wav_path)

    voice = compute_voice_metrics(transcript, duration_sec)

    question_text = interview.get("question", "")
    answer_metrics = compute_answer_metrics(question_text, transcript or "", voice.get("fillers", 0))

    content_score = int(round(
        (answer_metrics["relevance"] + answer_metrics["clarity"] + answer_metrics["structure"] + answer_metrics["completeness"]) / 4
    ))

    scores = {
        "overall": int(round((voice["confidence"] + content_score + body["engagement"]) / 3)),
        "confidence": voice["confidence"],
        "communication": 80,
        "body": body["engagement"],
        "content": content_score,
    }

    updated = update_interview(interview_id, {
        "scores": scores,
        "transcript": transcript,
        "voice_metrics": voice,
        "answer_metrics": answer_metrics,
        "body_metrics": body,
    })

    return updated

# --------- Results ---------

@app.get("/results/{interview_id}")
def get_results(interview_id: str, user=Depends(get_current_user)):
    interview = get_interview(interview_id)
    if not interview or interview["user_id"] != user["id"]:
        raise HTTPException(status_code=404, detail="Not found")
    return interview

# --------- Reports ---------

@app.get("/interviews")
def get_all(user=Depends(get_current_user)):
    return list_interviews_by_user(user["id"])

# --------- Generate Questions ---------

@app.post("/generate-questions")
def generate_questions(data: dict):

    role = data.get("role", "Software Engineer")
    difficulty = data.get("difficulty", "Medium")

    role_questions = QUESTION_BANK.get(role, {})
    diff_questions = role_questions.get(difficulty, [])

    if not diff_questions:
        diff_questions = ["Tell me about yourself."]

    questions = random.sample(diff_questions, min(5, len(diff_questions)))

    return {
        "questions": questions
    }