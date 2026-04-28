# AIVOA HCP CRM AI-First Module

This repository contains a production-quality implementation of an AI-first CRM module for Healthcare Professionals (HCPs), specifically a "Log Interaction Screen" that supports both structured form entry and a conversational AI chat interface.

## Tech Stack
- **Frontend**: React (Vite, TypeScript), Redux Toolkit, Vanilla CSS (Premium Dark Mode).
- **Backend**: Python, FastAPI.
- **AI Agent**: LangGraph with Groq (Gemma-2-9b).
- **Database**: PostgreSQL (SQLAlchemy models provided).
- **Typography**: Google Inter Font.

## Architecture
The system uses a **Synchronized State** pattern. The Redux store acts as the single source of truth. The LangGraph agent extracts entities (interaction summary, type, sentiment) from the chat and dispatches tool calls that update the Redux state via the backend, ensuring the form and chat are always in sync.

## Project Structure
```text
.
├── backend/
│   ├── app/
│   │   ├── agents/      # LangGraph workflow and tools
│   │   ├── api/         # FastAPI routes
│   │   ├── db/          # SQLAlchemy models and session
│   │   └── main.py      # Entry point
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/  # UI Components (LogInteractionScreen)
    │   ├── store/       # Redux Toolkit (Slices and Store)
    │   └── main.tsx     # App entry
    └── index.html
```

## Setup Instructions

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   - Copy `.env.sample` to `.env`.
   - Add your `GROQ_API_KEY`.
4. Run the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

### 2. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Key Features
- **Dual Mode**: Toggle mentally between chatting with the AI and manually editing the form.
- **Smart Extraction**: AI automatically fills in clinical notes and detects interaction sentiment.
- **Audit Trails**: Built-in support for versioning and logging every change for compliance.
- **Premium Design**: Sleek, high-contrast dark mode interface following modern enterprise standards.

---
*Developed for AIVOA.AI Assessment.*
