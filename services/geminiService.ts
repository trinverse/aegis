import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { AnalysisResult, IncidentDetails, ImpactForecast, TeamBriefing, TrainingScenario } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const proModel = 'gemini-2.5-pro';
const flashModel = 'gemini-2.5-flash';

// Schemas for structured responses
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: { type: Type.STRING, description: "A brief, concise summary of the incident." },
        recommendedActions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of immediate, actionable steps for emergency responders." },
        potentialRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of potential secondary risks or cascading effects." },
        resourceSuggestions: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of suggested resources (personnel, equipment) to allocate." },
    },
    required: ["summary", "recommendedActions", "potentialRisks", "resourceSuggestions"],
};

const impactForecastSchema = {
    type: Type.OBJECT,
    properties: {
        shortTermImpacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Immediate potential impacts within the next 0-12 hours." },
        longTermImpacts: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Potential cascading impacts over the next 12-72 hours." },
        communityLifelines: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    lifeline: { type: Type.STRING, description: "The community lifeline affected (e.g., Energy, Water, Communications, Transportation)." },
                    impact: { type: Type.STRING, description: "Specific impact on this lifeline." },
                    mitigation: { type: Type.STRING, description: "A brief suggestion to mitigate this impact." },
                },
                required: ["lifeline", "impact", "mitigation"],
            }
        }
    },
    required: ["shortTermImpacts", "longTermImpacts", "communityLifelines"],
};

const teamBriefingSchema = {
    type: Type.OBJECT,
    properties: {
        missionStatement: { type: Type.STRING, description: "A clear, concise mission statement for the response team." },
        keyObjectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "3-5 primary objectives for the initial operational period." },
        knownRisks: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Key risks for responder safety and mission success." },
        commsPlan: { type: Type.STRING, description: "A brief communications plan, including key frequencies or channels." },
    },
    required: ["missionStatement", "keyObjectives", "knownRisks", "commsPlan"],
};

const trainingScenarioSchema = {
    type: Type.OBJECT,
    properties: {
        scenarioTitle: { type: Type.STRING, description: "A descriptive title for the training scenario." },
        learningObjectives: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Specific learning objectives for the training participants." },
        initialBriefing: { type: Type.STRING, description: "The initial situation briefing to be read to participants." },
        timelineInjects: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    time: { type: Type.STRING, description: "Simulation time for the event (e.g., T+01:00)." },
                    event: { type: Type.STRING, description: "The event or information to inject into the scenario." },
                    expectedAction: { type: Type.STRING, description: "The expected action or decision from the participants." },
                },
                required: ["time", "event", "expectedAction"],
            }
        }
    },
    required: ["scenarioTitle", "learningObjectives", "initialBriefing", "timelineInjects"],
};

async function generateJson<T>(model: string, prompt: string, schema: object): Promise<T> {
    try {
        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: schema,
                temperature: 0.3,
            },
        });
        
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as T;
    } catch (error) {
        console.error(`Error generating JSON from model ${model}:`, error);
        throw new Error(`Failed to get a valid response from the AI. Please check the console.`);
    }
}


export async function getIncidentAnalysis(details: IncidentDetails): Promise<AnalysisResult> {
    const prompt = `Analyze the following emergency incident report and provide a structured response. Incident Type: ${details.incidentType}, Location: ${details.location}, Severity: ${details.severity}, Description: ${details.description}`;
    return generateJson<AnalysisResult>(proModel, prompt, analysisSchema);
}

export async function generateImpactForecast(details: IncidentDetails): Promise<ImpactForecast> {
    const prompt = `Generate a detailed impact forecast for this incident: Incident Type: ${details.incidentType}, Location: ${details.location}, Severity: ${details.severity}, Description: ${details.description}. Focus on short-term, long-term, and community lifeline impacts.`;
    return generateJson<ImpactForecast>(proModel, prompt, impactForecastSchema);
}

export async function generateTeamBriefing(analysis: AnalysisResult): Promise<TeamBriefing> {
    const prompt = `Based on the following incident analysis, create a standardized operational team briefing (ICS style). Analysis: ${JSON.stringify(analysis)}. The briefing must be clear, concise, and actionable for first responders.`;
    return generateJson<TeamBriefing>(proModel, prompt, teamBriefingSchema);
}

export async function generateTrainingScenario(details: IncidentDetails): Promise<TrainingScenario> {
    const prompt = `Create a tabletop training scenario based on this incident: Incident Type: ${details.incidentType}, Location: ${details.location}, Description: ${details.description}. Include learning objectives and a timeline of events (injects) to test decision-making.`;
    return generateJson<TrainingScenario>(proModel, prompt, trainingScenarioSchema);
}

export function createPreparednessChat(): Chat {
    const chat = ai.chats.create({
        model: flashModel,
        config: {
            systemInstruction: `You are an expert in emergency preparedness and public safety. Your role is to provide clear, concise, and actionable advice to the general public. Answer questions about creating emergency kits, evacuation plans, and safety procedures for various disasters. Be calm, reassuring, and authoritative. Use lists and simple language.`,
            temperature: 0.7,
        }
    });
    return chat;
}