# backend/crud.py

_store = {}

def create_interview(data: dict):
    _store[data["id"]] = data
    return data

def get_interview(interview_id: str):
    return _store.get(interview_id)

def get_all_interviews():
    return list(_store.values())