export interface IncidentDetails {
  incidentType: string;
  location: string;
  severity: string;
  description: string;
}

export interface AnalysisResult {
  summary: string;
  recommendedActions: string[];
  potentialRisks: string[];
  resourceSuggestions: string[];
}

export interface ImpactForecast {
  shortTermImpacts: string[];
  longTermImpacts: string[];
  communityLifelines: {
    lifeline: string;
    impact: string;
    mitigation: string;
  }[];
}

export interface TeamBriefing {
  missionStatement: string;
  keyObjectives: string[];
  knownRisks: string[];
  commsPlan: string;
}

export interface TrainingScenario {
  scenarioTitle: string;
  learningObjectives: string[];
  initialBriefing: string;
  timelineInjects: {
    time: string;
    event: string;
    expectedAction: string;
  }[];
}

export interface ChatMessage {
    sender: 'user' | 'model';
    text: string;
}