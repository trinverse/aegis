from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import os
from dotenv import load_dotenv
import google.generativeai as genai
import json
import re

# Load environment variables
load_dotenv()

# Configure Gemini
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
if not GEMINI_API_KEY:
    raise ValueError("GEMINI_API_KEY environment variable not set")

genai.configure(api_key=GEMINI_API_KEY)

app = FastAPI(title="Aegis Emergency Management API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models matching TypeScript types
class IncidentDetails(BaseModel):
    incidentType: str
    location: str
    severity: str
    description: str

class AnalysisResult(BaseModel):
    summary: str
    recommendedActions: List[str]
    potentialRisks: List[str]
    resourceSuggestions: List[str]

class CommunityLifeline(BaseModel):
    lifeline: str
    impact: str
    mitigation: str

class ImpactForecast(BaseModel):
    shortTermImpacts: List[str]
    longTermImpacts: List[str]
    communityLifelines: List[CommunityLifeline]

class TeamBriefing(BaseModel):
    missionStatement: str
    keyObjectives: List[str]
    knownRisks: List[str]
    commsPlan: str

class TimelineInject(BaseModel):
    time: str
    event: str
    expectedAction: str

class TrainingScenario(BaseModel):
    scenarioTitle: str
    learningObjectives: List[str]
    initialBriefing: str
    timelineInjects: List[TimelineInject]

class PreparednessChatRequest(BaseModel):
    sessionId: Optional[str] = None
    message: str

class PreparednessChatResponse(BaseModel):
    sessionId: str
    response: str

# Chat sessions storage (in-memory for now)
chat_sessions = {}

# Gemini generation config
generation_config = {
    "temperature": 0.3,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
}

def clean_json_response(text: str) -> str:
    """Clean JSON response from Gemini API by removing markdown code blocks and comments."""
    # Remove markdown code blocks
    text = re.sub(r'```json\s*', '', text)
    text = re.sub(r'```\s*$', '', text)
    # Remove // style comments
    text = re.sub(r'//.*$', '', text, flags=re.MULTILINE)
    # Remove trailing commas before closing braces/brackets
    text = re.sub(r',(\s*[}\]])', r'\1', text)
    return text.strip()

@app.get("/")
async def root():
    return {"message": "Aegis Emergency Management API", "status": "running"}

@app.post("/incident-analysis", response_model=AnalysisResult)
async def analyze_incident(details: IncidentDetails):
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.3,
                "response_mime_type": "application/json",
            },
        )

        prompt = f"""Analyze the following emergency incident report and provide a structured JSON response.

Incident Type: {details.incidentType}
Location: {details.location}
Severity: {details.severity}
Description: {details.description}

Respond ONLY with valid JSON matching this exact structure:
{{
    "summary": "A brief, concise summary of the incident",
    "recommendedActions": ["list of immediate, actionable steps for emergency responders"],
    "potentialRisks": ["list of potential secondary risks or cascading effects"],
    "resourceSuggestions": ["list of suggested resources (personnel, equipment) to allocate"]
}}"""

        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        result = json.loads(cleaned_text)
        return AnalysisResult(**result)
    except Exception as e:
        import traceback
        error_detail = f"Error analyzing incident: {str(e)}\n{traceback.format_exc()}"
        print(error_detail)
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/impact-forecast", response_model=ImpactForecast)
async def generate_impact_forecast(details: IncidentDetails):
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.3,
                "response_mime_type": "application/json",
            },
        )

        prompt = f"""Generate a detailed impact forecast for this incident:

Incident Type: {details.incidentType}
Location: {details.location}
Severity: {details.severity}
Description: {details.description}

Focus on short-term, long-term, and community lifeline impacts.

Provide a JSON response with the following structure:
{{
    "shortTermImpacts": ["immediate potential impacts within the next 0-12 hours"],
    "longTermImpacts": ["potential cascading impacts over the next 12-72 hours"],
    "communityLifelines": [
        {{
            "lifeline": "The community lifeline affected (e.g., Energy, Water, Communications, Transportation)",
            "impact": "Specific impact on this lifeline",
            "mitigation": "A brief suggestion to mitigate this impact"
        }}
    ]
}}"""

        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        result = json.loads(cleaned_text)
        return ImpactForecast(**result)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Error parsing JSON response: {str(e)}. Raw response: {response.text[:500]}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating impact forecast: {str(e)}")

@app.post("/team-briefing", response_model=TeamBriefing)
async def generate_team_briefing(data: dict):
    try:
        analysis = data.get("analysis")
        if not analysis:
            raise HTTPException(status_code=400, detail="Analysis data required")

        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.3,
                "response_mime_type": "application/json",
            },
        )

        prompt = f"""Based on the following incident analysis, create a standardized operational team briefing (ICS style).

Analysis: {json.dumps(analysis)}

The briefing must be clear, concise, and actionable for first responders.

Provide a JSON response with the following structure:
{{
    "missionStatement": "A clear, concise mission statement for the response team",
    "keyObjectives": ["3-5 primary objectives for the initial operational period"],
    "knownRisks": ["Key risks for responder safety and mission success"],
    "commsPlan": "A brief communications plan, including key frequencies or channels"
}}"""

        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        result = json.loads(cleaned_text)
        return TeamBriefing(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating team briefing: {str(e)}")

@app.post("/training-scenario", response_model=TrainingScenario)
async def generate_training_scenario(details: IncidentDetails):
    try:
        model = genai.GenerativeModel(
            model_name="gemini-2.5-flash",
            generation_config={
                "temperature": 0.3,
                "response_mime_type": "application/json",
            },
        )

        prompt = f"""Create a tabletop training scenario based on this incident:

Incident Type: {details.incidentType}
Location: {details.location}
Description: {details.description}

Include learning objectives and a timeline of events (injects) to test decision-making.

Provide a JSON response with the following structure:
{{
    "scenarioTitle": "A descriptive title for the training scenario",
    "learningObjectives": ["Specific learning objectives for the training participants"],
    "initialBriefing": "The initial situation briefing to be read to participants",
    "timelineInjects": [
        {{
            "time": "Simulation time for the event (e.g., T+01:00)",
            "event": "The event or information to inject into the scenario",
            "expectedAction": "The expected action or decision from the participants"
        }}
    ]
}}"""

        response = model.generate_content(prompt)
        cleaned_text = clean_json_response(response.text)
        result = json.loads(cleaned_text)
        return TrainingScenario(**result)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating training scenario: {str(e)}")

@app.post("/preparedness-chat", response_model=PreparednessChatResponse)
async def preparedness_chat(request: PreparednessChatRequest):
    try:
        session_id = request.sessionId or f"session_{len(chat_sessions)}"

        # Get or create chat session
        if session_id not in chat_sessions:
            model = genai.GenerativeModel(
                model_name="gemini-2.5-flash",
                generation_config={
                    "temperature": 0.7,
                    "top_p": 0.95,
                    "top_k": 40,
                    "max_output_tokens": 8192,
                },
                system_instruction="""You are an expert in emergency preparedness and public safety.
Your role is to provide clear, concise, and actionable advice to the general public.
Answer questions about creating emergency kits, evacuation plans, and safety procedures for various disasters.
Be calm, reassuring, and authoritative. Use lists and simple language."""
            )
            chat_sessions[session_id] = model.start_chat(history=[])

        chat = chat_sessions[session_id]
        response = chat.send_message(request.message)

        return PreparednessChatResponse(
            sessionId=session_id,
            response=response.text
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error in chat: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
