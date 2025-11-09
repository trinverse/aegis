# Aegis Setup Guide

## Quick Start

### Option 1: Using the Start Script (Recommended)

**Terminal 1 - Backend:**
```bash
./start-backend.sh
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

### Option 2: Manual Setup

**Terminal 1 - Backend:**
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m app.main
```

**Terminal 2 - Frontend:**
```bash
npm install
npm run dev
```

## Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## Configuration

### Gemini API Key

The API key is already configured in `backend/.env`. If you need to update it:

1. Get your API key from: https://aistudio.google.com/apikey
2. Edit `backend/.env`:
   ```
   GEMINI_API_KEY=your_new_key_here
   ```
3. Restart the backend server

## Architecture Changes

### Before (Insecure)
- API key exposed in client-side code via Vite
- Direct Gemini API calls from browser
- API key visible in network requests

### After (Secure)
- API key stored only on backend server
- All AI requests proxied through FastAPI
- Client never sees the API key
- Proper separation of concerns

## File Structure

```
aegis/
├── backend/              # Python FastAPI server
│   ├── app/
│   │   ├── __init__.py
│   │   └── main.py      # FastAPI routes and Gemini integration
│   ├── .env             # API key (DO NOT COMMIT)
│   ├── .gitignore
│   ├── requirements.txt
│   └── README.md
├── components/          # React components (updated to use API)
├── services/
│   ├── apiClient.ts    # NEW: Backend API client
│   └── geminiService.ts # OLD: Direct Gemini calls (not used)
├── .gitignore          # Updated for Python
├── README.md           # Updated instructions
└── start-backend.sh    # Convenience script
```

## Troubleshooting

### Backend won't start
- Ensure Python 3.8+ is installed: `python3 --version`
- Check if port 8000 is available
- Verify API key is set in `backend/.env`

### Frontend can't connect to backend
- Ensure backend is running on port 8000
- Check browser console for CORS errors
- Verify `apiClient.ts` is using correct URL

### API Key Issues
- Verify key is valid at https://aistudio.google.com/apikey
- Check that Generative Language API is enabled
- Ensure key is set in `backend/.env` (not root `.env.local`)

## Development Notes

- The old `services/geminiService.ts` is no longer used but kept for reference
- All components now import from `services/apiClient.ts`
- CORS is configured for localhost development
- For production, update CORS settings in `backend/app/main.py`
