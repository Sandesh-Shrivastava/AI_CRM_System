# AI CRM System

This repository contains a production-quality implementation of an AI-first CRM module for Healthcare Professionals (HCPs), specifically a "Log Interaction Screen" that supports both structured form entry and a conversational AI chat interface.

## Tech Stack
- **Frontend**: React (Vite v5.4, TypeScript), Redux Toolkit, Vanilla CSS (Premium Light Mode & Glassmorphism).
- **Backend**: Python, FastAPI.
- **AI Agent**: LangGraph with LangChain & Groq (Llama-3.3-70b).
- **Database**: PostgreSQL (SQLAlchemy models provided).
- **Typography**: Google Inter Font.

## Architecture
The system uses a **Synchronized State** pattern. The Redux store acts as the single source of truth. The LangGraph agent extracts entities (interaction summary, type, sentiment) from the chat and dispatches tool calls that update the Redux state via the backend, ensuring the form and chat are always in sync. The AI is fully connected to the PostgreSQL database, executing SQL queries in real-time to fetch HCP data and create follow-up tasks.

## Project Structure
```text
.
├── backend/
│   ├── app/
│   │   ├── agents/      # LangGraph workflow, system prompt, and tools
│   │   ├── db/          # SQLAlchemy models, Base, and SessionLocal
│   │   └── main.py      # FastAPI Entry point & Endpoints
│   ├── init_db.py       # Database seeding script
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── components/  # UI Components (LogInteractionScreen)
    │   ├── store/       # Redux Toolkit (Interaction Slice and Store)
    │   ├── index.css    # Custom UI styling and layout structure
    │   └── main.tsx     # App entry
    └── index.html
```

## Setup Instructions

### 1. Backend & Database Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create a virtual environment and install dependencies:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```
3. Configure environment variables:
   - Create a `.env` file in the `backend` folder.
   - Add your API keys and database URL:
     ```env
     GROQ_API_KEY=your_api_key_here
     DATABASE_URL=postgresql://user:password@localhost:5432/aivoa_crm
     ```
4. Initialize and seed the database:
   ```bash
   python3 init_db.py
   ```
   *(This creates the tables and adds sample doctors: Dr. Aris Ray, Dr. John Smith, and Dr. Sarah Johnson).*
5. Run the FastAPI server:
   ```bash
   python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
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
3. Start the development server (runs on Vite v5.4 for Mac ARM compatibility):
   ```bash
   npm run dev
   ```

## Key Features
- **Real-Time Database Intelligence**: The AI uses tools like `get_hcp_profile` and `create_follow_up` to directly read and write to the PostgreSQL database based on conversational input.
- **Clinical Knowledge Retrieval**: Integrated `search_medical_content` tool allows the AI to answer complex medical and trial-related questions directly in the chat.
- **Smart Form Sync**: The LangGraph agent automatically extracts complex clinical notes and interaction sentiments, instantly updating the React frontend without a page refresh.
- **Premium Floating UI**: Features a sleek, high-end Light Mode interface with glassmorphism effects, animated chat bubbles, and a dedicated floating AI Assistant panel.
