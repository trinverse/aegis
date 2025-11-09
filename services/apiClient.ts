import type {
  AnalysisResult,
  IncidentDetails,
  ImpactForecast,
  TeamBriefing,
  TrainingScenario,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function postJson<TResponse>(path: string, body: unknown): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request to ${path} failed with status ${response.status}`);
  }

  return response.json() as Promise<TResponse>;
}

export async function getIncidentAnalysis(details: IncidentDetails): Promise<AnalysisResult> {
  return postJson<AnalysisResult>('/incident-analysis', details);
}

export async function generateImpactForecast(details: IncidentDetails): Promise<ImpactForecast> {
  return postJson<ImpactForecast>('/impact-forecast', details);
}

export async function generateTeamBriefing(analysis: AnalysisResult): Promise<TeamBriefing> {
  return postJson<TeamBriefing>('/team-briefing', { analysis });
}

export async function generateTrainingScenario(details: IncidentDetails): Promise<TrainingScenario> {
  return postJson<TrainingScenario>('/training-scenario', details);
}

export async function sendPreparednessMessage(
  sessionId: string | null,
  message: string
): Promise<{ sessionId: string; response: string }> {
  return postJson<{ sessionId: string; response: string }>('/preparedness-chat', {
    sessionId,
    message,
  });
}
