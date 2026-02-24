# backend/repositories.py
from db import interviews_col

def create_interview(doc: dict):
    interviews_col.insert_one(doc)
    return doc

def update_interview(interview_id: str, updates: dict):
    interviews_col.update_one({"id": interview_id}, {"$set": updates})
    return interviews_col.find_one({"id": interview_id}, {"_id": 0})

def get_interview(interview_id: str):
    return interviews_col.find_one({"id": interview_id}, {"_id": 0})

def list_interviews():
    return list(interviews_col.find({}, {"_id": 0}))