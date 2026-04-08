import re
from typing import Dict
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

STAR_KEYWORDS = ["situation", "task", "action", "result", "impact", "outcome"]

def _clean(text: str) -> str:
    return re.sub(r"\s+", " ", text.lower().strip())

def relevance_score(question: str, answer: str) -> int:
    texts = [_clean(question), _clean(answer)]
    vec = TfidfVectorizer(stop_words="english")
    tfidf = vec.fit_transform(texts)
    sim = cosine_similarity(tfidf[0:1], tfidf[1:2])[0][0]
    return int(max(0, min(100, round(sim * 100))))

def completeness_score(answer: str) -> int:
    words = re.findall(r"\b\w+\b", answer)
    wc = len(words)
    # heuristic bands
    if wc < 40: return 50
    if wc < 80: return 65
    if wc < 140: return 80
    return 90

def clarity_score(answer: str, fillers: int) -> int:
    sentences = re.split(r"[.!?]+", answer)
    sentences = [s for s in sentences if s.strip()]
    avg_len = (sum(len(re.findall(r"\b\w+\b", s)) for s in sentences) / max(1, len(sentences)))
    score = 80
    if avg_len > 30: score -= 10  # very long sentences
    score -= min(fillers * 2, 20)
    return int(max(40, min(95, score)))

def structure_score(answer: str) -> int:
    text = _clean(answer)
    hits = sum(1 for k in STAR_KEYWORDS if k in text)
    # map hits to score
    if hits == 0: return 55
    if hits == 1: return 65
    if hits == 2: return 75
    if hits >= 3: return 85
    return 70

def compute_answer_metrics(question: str, answer: str, fillers: int) -> Dict[str, int]:
    rel = relevance_score(question, answer)
    comp = completeness_score(answer)
    clar = clarity_score(answer, fillers)
    struct = structure_score(answer)

    return {
        "relevance": rel,
        "completeness": comp,
        "clarity": clar,
        "structure": struct,
    }