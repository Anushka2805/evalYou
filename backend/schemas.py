from typing import Dict, Any
from pydantic import BaseModel

class InterviewResponse(BaseModel):
    id: str
    title: str
    date: str
    role: str
    mode: str
    difficulty: str
    video_path: str
    scores: Dict[str, Any]