from typing import Dict, Any
from datetime import datetime

def interview_model(data: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "id": data.get("id"),
        "title": data.get("title"),
        "date": data.get("date"),
        "role": data.get("role"),
        "mode": data.get("mode"),
        "difficulty": data.get("difficulty"),
        "video_path": data.get("video_path"),
        "scores": data.get("scores", {}),
        "created_at": datetime.utcnow(),
    }