# backend/users_repo.py
from db import db

users_col = db["users"]

def create_user(user: dict):
    users_col.insert_one(user)
    return user

def get_user_by_email(email: str):
    return users_col.find_one({"email": email}, {"_id": 0})

def get_user_by_id(user_id: str):
    return users_col.find_one({"id": user_id}, {"_id": 0})