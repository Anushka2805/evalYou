# EvalYou — AI-Powered Interview Evaluation Platform

EvalYou is an AI-powered mock interview platform that analyzes a candidate’s **communication skills, confidence, body language, and answer quality** using Speech AI, Computer Vision, and Natural Language Processing.

The platform simulates realistic interview environments and generates **detailed performance reports and personalized improvement suggestions** to help candidates prepare for real interviews.

---

# Key Features

## AI Interview Evaluation

EvalYou records interview responses and analyzes multiple behavioral and communication signals to generate a detailed evaluation report.

The system evaluates:

- Communication clarity
- Speaking confidence
- Body language signals
- Answer quality
- Response structure and relevance

Each interview generates structured feedback and improvement suggestions.

---

## Role-Based Interview Simulation

Users can practice interviews based on their **target role and experience level**.

Supported interview types include:

- Software Development Engineer (SDE)
- Data Analyst
- Product Manager
- HR Interviews
- Behavioral Interviews

The platform dynamically selects questions relevant to the chosen role and evaluates answers accordingly.

---

## Speech Analysis

The platform evaluates multiple voice metrics to measure communication effectiveness.

Speech analysis includes:

- filler word detection (umm, uhh, like)
- speaking speed analysis
- pause and hesitation detection
- voice stability
- articulation clarity

These insights help identify nervous speaking patterns and improve delivery.

---

## Body Language Analysis

Computer vision techniques are used to analyze non-verbal interview behavior.

Body language evaluation includes:

- eye contact detection
- facial expression analysis
- posture tracking
- distraction detection
- head movement analysis

These signals contribute to the overall confidence score.

---

## Content Quality Evaluation

Natural Language Processing evaluates the structure and relevance of answers.

The system analyzes:

- answer relevance to the question
- STAR method structure detection
- vocabulary richness
- repetition detection
- grammar and fluency

This ensures answers are both **confident and well structured**.

---

## Interview Performance Dashboard

After each interview session, the platform generates a detailed performance dashboard including:

- Overall Interview Score
- Communication Score
- Confidence Score
- Body Language Score
- Content Quality Score

Interactive analytics help users understand their performance patterns.

---

## Progress Tracking

EvalYou tracks improvement across multiple interviews.

Users can monitor:

- reduction in filler words
- improvement in speaking clarity
- increased confidence score
- overall performance trends

This helps candidates measure improvement over time.

---

# System Architecture

Frontend (Next.js + TypeScript)

- Interview interface
- Dashboard and analytics
- Role selection and onboarding

Backend (Python AI Services)

- Speech analysis
- Computer vision analysis
- NLP answer evaluation
- Interview scoring engine

Database

- Interview session storage
- performance analytics
- user progress tracking

---

# Quick Start

## Prerequisites

- Node.js ≥ 18  
- Python ≥ 3.10  
- npm or yarn  

---

## Clone Repository

```bash
git clone https://github.com/Anushka2805/evalYou.git
cd evalYou
```

---

## Backend Setup

```bash
cd backend

python -m venv venv

# Windows
venv\Scripts\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
```

---

## Run Backend

```bash
cd backend
python -m uvicorn main:app --reload
```

Backend runs on

```
http://127.0.0.1:8000
```

---

## Frontend Setup

```bash
npm install
```

---

## Run Frontend

```bash
npm run dev
```

Frontend runs on

```
http://localhost:3000
```

---

# Project Structure

```
evalYou
│
├── app
│   ├── (app)
│   │   ├── analyzing
│   │   ├── coach
│   │   ├── dashboard
│   │   ├── interview
│   │   ├── new-interview
│   │   ├── reports
│   │   ├── results
│   │   └── settings
│   │
│   ├── auth
│   ├── onboarding
│   └── layout.tsx
│
├── components
│   ├── Navbar.tsx
│   ├── Sidebar.tsx
│   ├── FeatureCard.tsx
│   ├── StatCard.tsx
│   └── PageTransition.tsx
│
├── store
│
├── backend
│   ├── main.py
│   ├── config.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   │
│   ├── whisper_utils.py
│   ├── audio_utils.py
│   ├── voice_metrics.py
│   ├── body_metrics.py
│   ├── answer_metrics.py
│   │
│   ├── auth.py
│   ├── crud.py
│   ├── repositories.py
│   └── users_repo.py
│
├── public
├── package.json
├── requirements.txt
└── README.md
```

---

# Technology Stack

Frontend

- Next.js
- TypeScript
- TailwindCSS
- Framer Motion

Backend

- Python
- FastAPI / Flask
- OpenCV
- Librosa
- NumPy

AI / ML

- Whisper Speech Recognition
- Computer Vision Models
- NLP Analysis

---

# Example Interview Output

After completing an interview session, EvalYou generates structured results.

```
Overall Interview Score: 78%

Communication Score: 74
Confidence Score: 81
Body Language Score: 69
Content Quality Score: 80
```

Analytics include:

- confidence timeline
- filler word frequency
- eye contact percentage
- answer quality insights

---

# Author

**Anushka Aggarwal**

EvalYou was built to help candidates improve interview performance through AI-powered analysis and structured feedback.

---

⭐ If you find this project useful, consider starring the repository.
