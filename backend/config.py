import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb+srv://anushkaggarwal2005_db_user:nuqGOeHP4ir0YDQ5@cluster0.fuj0otc.mongodb.net/?appName=Cluster0")
DB_NAME = os.getenv("DB_NAME", "evalyou")
UPLOAD_DIR = "uploads"