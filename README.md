<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Aegis - AI Emergency Management

AI-powered emergency management application built with React, TypeScript, and Google Gemini AI.

## Architecture

The application consists of two parts:
- **Frontend**: React + TypeScript + Vite
- **Backend**: FastAPI + Python (handles Gemini AI API calls securely)

## Run Locally

**Prerequisites:**
- Node.js (v18 or higher)
- Python 3.8 or higher

### Step 1: Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# The API key is already configured in backend/.env
# If you need to update it, get your key from: https://aistudio.google.com/apikey

# Start the server
python -m app.main
```

The backend will run at `http://localhost:8000`

### Step 2: Start the Frontend

Open a new terminal:

```bash
# From the root directory
npm install

# Start the dev server
npm run dev
```

The frontend will run at `http://localhost:3000`

## Features

- **Situational Awareness**: AI-powered incident analysis
- **Operations Hub**: Impact forecasts, team briefings, and training scenarios
- **Public Preparedness**: Interactive chat for emergency preparedness guidance

## Security

- API key is stored securely on the backend server
- Never exposed to client-side code
- CORS configured for secure communication

## Documentation

For more details, see:
- Backend API documentation: `backend/README.md`
- Technical architecture: `docs/architecture.md`
