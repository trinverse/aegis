# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Aegis is an AI-powered emergency management application built with React, TypeScript, and Vite. It uses Google's Gemini AI (via @google/genai) to provide intelligent analysis and conversational guidance for emergency response scenarios.

## Development Commands

### Setup
```bash
npm install
```

Create a `.env.local` file with your Gemini API key:
```
GEMINI_API_KEY=your_api_key_here
```

### Development
```bash
npm run dev          # Start dev server on http://localhost:3000
npm run build        # Build for production
npm run preview      # Preview production build
```

## Tech Stack

- **Frontend**: React 19.2.0 with TypeScript 5.8.2
- **Build Tool**: Vite 6.2.0
- **AI Integration**: @google/genai 1.25.0 (Gemini 2.5 Pro and Flash models)
- **Styling**: Tailwind CSS via CDN (no config file)
- **State Management**: React hooks (useState, useEffect) - no external state library
- **Dependency Loading**: Import maps for CDN-based dependencies (AI Studio pattern, see index.html:9-18)

## Architecture

### Application Flow & State Management

The app uses a **view-based navigation** pattern with critical state transitions:

1. **SituationalAwareness** (entry point): Users submit incident reports and receive AI analysis
2. **PublicPreparedness**: Standalone chat interface for emergency preparedness Q&A
3. **OperationsHub**: Advanced operational tools (ONLY accessible after analysis is complete)

**Critical State Guard**: Navigation to OperationsHub is blocked unless `analysisResult` exists (App.tsx:18-24). This prevents invalid state transitions.

### State Flow Between Components

- `App.tsx` maintains global state: `currentView`, `incidentDetails`, `analysisResult`
- State flows **downward** via props to child components
- State flows **upward** via callback functions (`setAnalysisResult`, `setIncidentDetails`, `setCurrentView`)
- The OperationsHub fetches additional data (forecast, briefing, scenario) independently using `useEffect` when mounted with valid incident data

### AI Service Architecture (services/geminiService.ts)

Two Gemini models are used strategically:
- **gemini-2.5-pro**: Complex structured analysis (incident analysis, impact forecasts, team briefings, training scenarios)
- **gemini-2.5-flash**: Fast conversational responses (public preparedness chat)

All structured responses use **JSON Schema validation** via `responseSchema` to ensure type safety and consistent output format. The `generateJson<T>()` helper provides type-safe response parsing.

### Component Responsibilities

- **SituationalAwareness**: Form submission, incident analysis via `getIncidentAnalysis()`, displays results, navigates to OperationsHub
- **OperationsHub**: Parallel fetches three data types on mount: impact forecast, team briefing, training scenario (uses `Promise.all` for performance)
- **PublicPreparedness**: Stateful chat interface with streaming responses via `chat.sendMessageStream()`

### Environment Variables

The Vite config (vite.config.ts:14-15) exposes the API key to the client via both `process.env.API_KEY` and `process.env.GEMINI_API_KEY`. The service reads it as `process.env.API_KEY` (geminiService.ts:4).

**Important**: The API key is exposed to the client side. This is acceptable for the AI Studio deployment model but should be moved to a backend service for production deployments.

### Path Aliases

The project uses `@/*` as an alias for the root directory (configured in both tsconfig.json and vite.config.ts). Use it for cleaner imports when adding new files.

### Styling

Tailwind CSS is loaded via CDN (index.html:8) and used throughout with inline utility classes. There is no Tailwind config file - all styling uses default Tailwind classes.

The design system uses a dark theme (gray-900 background) with color-coded sections:
- Blue: Primary actions and headers
- Yellow: Summaries and warnings
- Green: Recommended actions
- Red: Risks
- Cyan/Purple: Resources and training

### Type Definitions (types.ts)

All data structures are defined in `types.ts`:
- `IncidentDetails`: User-submitted incident information
- `AnalysisResult`: AI-generated initial analysis
- `ImpactForecast`, `TeamBriefing`, `TrainingScenario`: Operations Hub data
- `ChatMessage`: Chat interface messages

These types are shared between components and services, ensuring type safety across the application.

## Key Implementation Patterns

### Error Handling Pattern

All async operations follow this pattern:
```typescript
try {
    setIsLoading(true);
    setError(null);
    const result = await someAsyncOperation();
    // Update state with result
} catch (err) {
    console.error(err);
    setError(err instanceof Error ? err.message : 'Fallback message');
} finally {
    setIsLoading(false);
}
```

### AI Service Helper: generateJson<T>()

The `generateJson<T>()` helper in geminiService.ts provides type-safe JSON response parsing with automatic schema validation. All structured AI responses use this pattern:
- Model: gemini-2.5-pro
- Temperature: 0.3 (deterministic)
- Response format: JSON with schema validation
- Returns: Strongly typed TypeScript objects

### Parallel Data Fetching in OperationsHub

OperationsHub uses `Promise.all()` to fetch three independent data sets concurrently for performance (OperationsHub.tsx:27-31):
```typescript
const [forecastData, briefingData, scenarioData] = await Promise.all([
    generateImpactForecast(incidentDetails),
    generateTeamBriefing(analysisResult),
    generateTrainingScenario(incidentDetails),
]);
```

### Streaming Chat Implementation

PublicPreparedness uses async iteration to handle streaming responses (PublicPreparedness.tsx:40-51):
```typescript
const stream = await chat.sendMessageStream({ message });
for await (const chunk of stream) {
    modelResponse += chunk.text;
    // Update UI progressively
}
```

## Common Development Scenarios

### Adding a New View

1. Create component in `components/` directory
2. Add view type to `View` type in App.tsx:8
3. Add case to `renderView()` switch in App.tsx:29-49
4. Update Sidebar component to include new navigation item
5. Add appropriate state guards if needed (see handleSetCurrentView in App.tsx:16-25)

### Adding a New AI Service Method

1. Define TypeScript type in `types.ts`
2. Create JSON schema in `services/geminiService.ts` (follow existing schema patterns)
3. Implement service function using `generateJson<T>()` helper
4. Choose appropriate model: Pro for complex analysis, Flash for conversational
5. Export the function and use it in components with proper error handling

### Modifying AI Prompts

All prompts are inline strings in the service functions (geminiService.ts:100, 105, 110, 115). Prompts should:
- Be clear and specific about the task
- Include all relevant incident details
- Specify the desired output format
- Match the corresponding JSON schema structure

## Documentation

Comprehensive documentation is available in the `docs/` directory:
- `architecture.md`: Full system architecture with mermaid diagrams
- `ai-service.md`: Detailed AI service patterns and strategies
- `data-models.md`: Data structure documentation
- `user-flows.md`: User interaction flows
- `phase2/`: Future enhancement planning
