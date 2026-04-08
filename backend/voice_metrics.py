import re
import math

FILLER_WORDS = ["um", "uh", "like", "you know", "actually", "basically"]

def compute_voice_metrics(transcript: str, duration_sec: float):
    # Clean & tokenize
    text = transcript.lower().strip()
    words = re.findall(r"\b\w+\b", text)
    word_count = len(words)

    # WPM
    minutes = max(duration_sec / 60.0, 1e-6)
    wpm = round(word_count / minutes)

    # Filler count (phrase-aware)
    fillers = 0
    for fw in FILLER_WORDS:
        if " " in fw:
            fillers += len(re.findall(r"\b" + re.escape(fw) + r"\b", text))
        else:
            fillers += sum(1 for w in words if w == fw)

    # Pauses (rough heuristic): count long sentences gaps via punctuation
    # This is a proxy since we don't have timestamps here.
    pauses = max(0, len(re.findall(r"[.!?]", text)) - 1)

    # Simple confidence heuristic:
    # higher wpm (but not too high), fewer fillers, fewer pauses => higher confidence
    score = 70
    if wpm < 90: score -= 10
    if wpm > 180: score -= 10
    score -= min(fillers * 2, 20)
    score -= min(pauses * 2, 10)
    confidence = max(40, min(95, score))

    return {
        "wpm": int(wpm),
        "fillers": int(fillers),
        "pauses": int(pauses),
        "confidence": int(confidence),
    }