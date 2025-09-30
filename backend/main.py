from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer
from pydantic import BaseModel
from typing import List, Optional
import json
import hashlib
from datetime import datetime, timedelta
import os

app = FastAPI(title="Quiz Game API", version="1.0.0")

# CORS middleware for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()

# Data models
class User(BaseModel):
    id: int
    username: str
    email: str
    total_score: int = 0
    total_attempts: int = 0
    joined_date: str

class UserCreate(BaseModel):
    username: str
    email: str
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class Question(BaseModel):
    id: int
    question: str
    options: List[str]
    correct_answer: str

class Quiz(BaseModel):
    id: str
    title: str
    description: str
    difficulty: str
    date: str
    questions: List[Question]

class QuizResult(BaseModel):
    quiz_id: str
    score: int
    total_questions: int
    date: str

# Mock data storage (in production, use a proper database)
users_db = {}
quiz_results_db = []

# Sample quizzes
sample_quizzes = [
    {
        "id": "daily-1",
        "title": "Daily Quiz - General Knowledge",
        "description": "Test your general knowledge with today's quiz!",
        "difficulty": "medium",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "questions": [
            {
                "id": 1,
                "question": "What is the capital of France?",
                "options": ["London", "Berlin", "Paris", "Madrid"],
                "correct_answer": "Paris"
            },
            {
                "id": 2,
                "question": "Which planet is known as the Red Planet?",
                "options": ["Venus", "Mars", "Jupiter", "Saturn"],
                "correct_answer": "Mars"
            },
            {
                "id": 3,
                "question": "What is 2 + 2?",
                "options": ["3", "4", "5", "6"],
                "correct_answer": "4"
            },
            {
                "id": 4,
                "question": "Who painted the Mona Lisa?",
                "options": ["Van Gogh", "Picasso", "Da Vinci", "Michelangelo"],
                "correct_answer": "Da Vinci"
            },
            {
                "id": 5,
                "question": "What is the largest ocean on Earth?",
                "options": ["Atlantic", "Indian", "Arctic", "Pacific"],
                "correct_answer": "Pacific"
            }
        ]
    },
    {
        "id": "daily-2",
        "title": "Daily Quiz - Science",
        "description": "Challenge yourself with science questions!",
        "difficulty": "hard",
        "date": datetime.now().strftime("%Y-%m-%d"),
        "questions": [
            {
                "id": 1,
                "question": "What is the chemical symbol for gold?",
                "options": ["Go", "Gd", "Au", "Ag"],
                "correct_answer": "Au"
            },
            {
                "id": 2,
                "question": "How many bones are in an adult human body?",
                "options": ["206", "305", "186", "256"],
                "correct_answer": "206"
            },
            {
                "id": 3,
                "question": "What is the speed of light?",
                "options": ["300,000 km/s", "299,792,458 m/s", "186,000 mph", "All of the above"],
                "correct_answer": "All of the above"
            }
        ]
    }
]

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

@app.get("/")
async def root():
    return {"message": "Quiz Game API", "version": "1.0.0"}

@app.post("/api/auth/register")
async def register(user_data: UserCreate):
    if user_data.username in users_db:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    user = User(
        id=len(users_db) + 1,
        username=user_data.username,
        email=user_data.email,
        joined_date=datetime.now().isoformat()
    )
    
    users_db[user_data.username] = {
        "user": user,
        "password_hash": hash_password(user_data.password)
    }
    
    return {"user": user, "token": "mock-jwt-token"}

@app.post("/api/auth/login")
async def login(credentials: UserLogin):
    if credentials.username not in users_db:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    stored_data = users_db[credentials.username]
    if hash_password(credentials.password) != stored_data["password_hash"]:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    return {"user": stored_data["user"], "token": "mock-jwt-token"}

@app.get("/api/quizzes/daily")
async def get_daily_quizzes():
    return sample_quizzes

@app.get("/api/quizzes/{quiz_id}")
async def get_quiz(quiz_id: str):
    quiz = next((q for q in sample_quizzes if q["id"] == quiz_id), None)
    if not quiz:
        raise HTTPException(status_code=404, detail="Quiz not found")
    return quiz

@app.post("/api/quizzes/{quiz_id}/results")
async def submit_quiz_result(quiz_id: str, result: QuizResult):
    quiz_results_db.append(result.dict())
    return {"success": True, "message": "Result saved successfully"}

@app.get("/api/leaderboard")
async def get_leaderboard():
    # Mock leaderboard data
    leaderboard = [
        {"id": 1, "username": "QuizMaster", "totalScore": 450, "totalAttempts": 15},
        {"id": 2, "username": "BrainBox", "totalScore": 380, "totalAttempts": 12},
        {"id": 3, "username": "Smarty", "totalScore": 320, "totalAttempts": 10},
        {"id": 4, "username": "Genius", "totalScore": 290, "totalAttempts": 9},
        {"id": 5, "username": "Scholar", "totalScore": 250, "totalAttempts": 8}
    ]
    return leaderboard

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)