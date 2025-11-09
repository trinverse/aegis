# Aegis Backend API

FastAPI backend server for the Aegis Emergency Management application. Handles all Gemini AI API calls securely on the server side.

## Setup

### 1. Create a Python Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

The `.env` file already contains your Gemini API key. If you need to update it:

```bash
# Edit backend/.env
GEMINI_API_KEY=your_api_key_here
```

Get your API key from: https://aistudio.google.com/apikey

### 4. Run the Server

```bash
# From the backend directory
python -m app.main

# Or use uvicorn directly
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at: `http://localhost:8000`

## API Endpoints

### Health Check
- **GET** `/` - Server status check

### Incident Analysis
- **POST** `/incident-analysis` - Analyze an incident report
- **POST** `/impact-forecast` - Generate impact forecast
- **POST** `/team-briefing` - Generate team briefing
- **POST** `/training-scenario` - Generate training scenario

### Chat
- **POST** `/preparedness-chat` - Public preparedness chat endpoint

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Development

The backend uses:
- **FastAPI** - Modern Python web framework
- **Google Generative AI** - Gemini 2.0 Flash Exp model
- **Pydantic** - Data validation
- **CORS** - Enabled for frontend communication

## Security

- API key is stored server-side in `.env` file (never exposed to client)
- CORS configured for localhost development
- For production: Update CORS origins and use environment-specific configuration
