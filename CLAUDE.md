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

The Vite config (vite.config.ts:14-15) exposes the API key to the client via `process.env.GEMINI_API_KEY`. This is read in geminiService.ts:4.

### Path Aliases

The project uses `@/*` as an alias for the root directory (configured in both tsconfig.json and vite.config.ts). Use it for cleaner imports when adding new files.

### Styling

Tailwind CSS classes are used throughout for styling. The design system uses a dark theme (gray-900 background) with color-coded sections:
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
