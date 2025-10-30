# Architecture Documentation - Aegis AI Emergency Management

## System Architecture Overview

```mermaid
graph TB
    subgraph "Client Layer"
        UI[React UI Components]
        SM[State Management]
        NAV[Navigation Guards]
    end

    subgraph "Service Layer"
        GS[Gemini Service]
        VAL[Schema Validators]
        ERR[Error Handlers]
    end

    subgraph "AI Layer"
        PRO[Gemini Pro Model]
        FLASH[Gemini Flash Model]
    end

    subgraph "Data Layer"
        TYPES[TypeScript Types]
        SCHEMAS[JSON Schemas]
    end

    UI -->|User Input| SM
    SM -->|Validated State| NAV
    NAV -->|Route Control| UI
    UI -->|API Calls| GS
    GS -->|Structured Requests| VAL
    VAL -->|Validated Requests| PRO
    VAL -->|Chat Requests| FLASH
    PRO -->|JSON Response| SCHEMAS
    FLASH -->|Stream Response| GS
    SCHEMAS -->|Typed Data| TYPES
    TYPES -->|Type Safety| UI
    ERR -->|Error States| UI
```

## Component Architecture

### Component Hierarchy

```mermaid
graph TD
    App[App.tsx<br/>Main Container & State]
    App --> Sidebar[Sidebar.tsx<br/>Navigation & Guards]
    App --> SA[SituationalAwareness.tsx<br/>Incident Reporting]
    App --> PP[PublicPreparedness.tsx<br/>Chat Interface]
    App --> OH[OperationsHub.tsx<br/>Advanced Tools]

    SA --> GS1[GeminiService<br/>getIncidentAnalysis]
    PP --> GS2[GeminiService<br/>createPreparednessChat]
    OH --> GS3[GeminiService<br/>generateImpactForecast]
    OH --> GS4[GeminiService<br/>generateTeamBriefing]
    OH --> GS5[GeminiService<br/>generateTrainingScenario]

    Sidebar --> Icons[Icon Components]
    SA --> Icons2[Icon Components]
    PP --> Icons3[Icon Components]
    OH --> Icons4[Icon Components]
```

### Component Responsibilities

| Component | Primary Responsibility | State Management | AI Integration |
|-----------|----------------------|------------------|----------------|
| `App.tsx` | Application shell, view routing, global state | Owns incident and analysis state | None |
| `Sidebar.tsx` | Navigation, state-based guards | Receives hasAnalysis prop | None |
| `SituationalAwareness.tsx` | Incident input, analysis display | Local form state, updates global | Direct - Pro model |
| `PublicPreparedness.tsx` | Chat interface | Local chat history | Direct - Flash model |
| `OperationsHub.tsx` | Advanced tools display | Local operational data | Direct - Pro model |

## State Management Architecture

### State Flow Diagram

```mermaid
stateDiagram-v2
    [*] --> Idle: Initial Load
    Idle --> IncidentInput: User Starts Report
    IncidentInput --> Analyzing: Submit Incident
    Analyzing --> AnalysisComplete: AI Response
    AnalysisComplete --> OperationsUnlocked: State Updated

    AnalysisComplete --> IncidentInput: New Incident
    OperationsUnlocked --> ViewingOperations: Navigate to Ops
    ViewingOperations --> IncidentInput: New Incident

    state AnalysisComplete {
        [*] --> DisplayResults
        DisplayResults --> EnableNavigation
        EnableNavigation --> StoreGlobalState
    }
```

### State Management Strategy

```typescript
// Global State (App.tsx)
interface GlobalState {
    currentView: View;
    incidentDetails: IncidentDetails | null;
    analysisResult: AnalysisResult | null;
}

// Local Component States
interface SituationalAwarenessState {
    incidentType: string;
    location: string;
    severity: string;
    description: string;
    isLoading: boolean;
    error: string | null;
}

interface PublicPreparednessState {
    chat: Chat | null;
    messages: ChatMessage[];
    userInput: string;
    isLoading: boolean;
}

interface OperationsHubState {
    forecast: ImpactForecast | null;
    briefing: TeamBriefing | null;
    scenario: TrainingScenario | null;
    isLoading: boolean;
}
```

## Navigation Architecture

### Navigation Flow with Guards

```mermaid
flowchart TD
    Start([User Loads App]) --> SA[Situational Awareness View]
    SA --> InputIncident{Complete Incident Form?}
    InputIncident -->|Yes| Analyze[Generate Analysis]
    InputIncident -->|No| SA

    Analyze --> Success{Analysis Successful?}
    Success -->|Yes| UnlockOps[Enable Operations Hub]
    Success -->|No| ShowError[Display Error]
    ShowError --> SA

    UnlockOps --> Choice{User Navigation}
    Choice -->|Operations Hub| CheckGuard{Has Analysis?}
    Choice -->|Public Prep| PP[Public Preparedness]
    Choice -->|Stay| ViewAnalysis[View Analysis]

    CheckGuard -->|Yes| OH[Operations Hub]
    CheckGuard -->|No| BlockNav[Block Navigation]
    BlockNav --> SA

    OH --> Choice2{Continue?}
    Choice2 -->|New Incident| ClearState[Clear Analysis]
    ClearState --> SA
    Choice2 -->|Other View| Choice

    PP --> Choice
```

### Navigation Guard Implementation

```typescript
// Navigation guard logic in App.tsx
const handleSetCurrentView = (view: View) => {
    // Guard: Prevent navigation to Operations without analysis
    if (view === 'operations' && !analysisResult) {
        console.warn("Navigation blocked: No analysis available");
        return;
    }
    setCurrentView(view);
};

// Sidebar reflects guard state
<button
    disabled={item.id === 'operations' && !hasAnalysis}
    className={item.disabled ? 'opacity-50 cursor-not-allowed' : ''}
/>
```

## Data Flow Architecture

### Request/Response Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as React Component
    participant Service as GeminiService
    participant Validator as Schema Validator
    participant AI as Gemini AI

    User->>UI: Input Incident Details
    UI->>UI: Validate Form
    UI->>Service: getIncidentAnalysis(details)
    Service->>Validator: Prepare Schema
    Service->>AI: generateContent(prompt, schema)
    AI->>AI: Process with Model
    AI-->>Service: JSON Response
    Service->>Validator: Validate Response
    Validator-->>Service: Typed Object
    Service-->>UI: AnalysisResult
    UI-->>User: Display Analysis

    alt Error Case
        AI-->>Service: Error/Invalid
        Service-->>UI: Error Message
        UI-->>User: Show Error State
    end
```

### Data Transformation Pipeline

```mermaid
graph LR
    UserInput[User Input<br/>Raw Form Data] --> Validation[Form Validation<br/>Required Fields]
    Validation --> TypedData[Typed Data<br/>IncidentDetails]
    TypedData --> Prompt[Prompt Generation<br/>Structured Text]
    Prompt --> AIRequest[AI Request<br/>+ JSON Schema]
    AIRequest --> AIResponse[AI Response<br/>Raw JSON]
    AIResponse --> Parse[JSON Parse<br/>Object Creation]
    Parse --> TypeCheck[Type Assertion<br/>TypeScript Types]
    TypeCheck --> UIRender[UI Render<br/>Formatted Display]
```

## AI Service Architecture Overview

### Model Selection Strategy

```mermaid
flowchart TD
    Request([AI Request]) --> Type{Request Type?}
    Type -->|Complex Analysis| Pro[Gemini Pro<br/>High Capability]
    Type -->|Simple Chat| Flash[Gemini Flash<br/>Fast & Efficient]

    Pro --> Config1[Temperature: 0.3<br/>Structured Output]
    Flash --> Config2[Temperature: 0.7<br/>Conversational]

    Config1 --> Schema[JSON Schema<br/>Validation]
    Config2 --> Stream[Stream Response<br/>Real-time]

    Schema --> Response1[Structured Data<br/>Predictable]
    Stream --> Response2[Progressive Text<br/>Interactive]
```

### Service Method Architecture

```mermaid
classDiagram
    class GeminiService {
        -GoogleGenAI ai
        -string proModel
        -string flashModel
        +getIncidentAnalysis(IncidentDetails) AnalysisResult
        +generateImpactForecast(IncidentDetails) ImpactForecast
        +generateTeamBriefing(AnalysisResult) TeamBriefing
        +generateTrainingScenario(IncidentDetails) TrainingScenario
        +createPreparednessChat() Chat
        -generateJson(model, prompt, schema) T
    }

    class AnalysisResult {
        +string summary
        +string[] recommendedActions
        +string[] potentialRisks
        +string[] resourceSuggestions
    }

    class Chat {
        +sendMessageStream(message) Stream
    }

    GeminiService --> AnalysisResult : generates
    GeminiService --> Chat : creates
```

## Error Handling Architecture

### Error Handling Flow

```mermaid
flowchart TD
    Operation([Any Operation]) --> Try{Try Block}
    Try -->|Success| Process[Process Result]
    Try -->|API Error| CatchAPI[Catch API Error]
    Try -->|Network Error| CatchNet[Catch Network Error]
    Try -->|Parse Error| CatchParse[Catch Parse Error]

    CatchAPI --> LogAPI[Log to Console]
    CatchNet --> LogNet[Log to Console]
    CatchParse --> LogParse[Log to Console]

    LogAPI --> UserAPI[User-Friendly Message]
    LogNet --> UserNet[Network Error Message]
    LogParse --> UserParse[Invalid Response Message]

    UserAPI --> UIError[Display in UI]
    UserNet --> UIError
    UserParse --> UIError

    UIError --> Retry{Retry Available?}
    Retry -->|Yes| ShowRetry[Show Retry Button]
    Retry -->|No| ShowHelp[Show Help Text]
```

### Error States by Component

| Component | Error Types | User Feedback | Recovery Strategy |
|-----------|------------|---------------|-------------------|
| SituationalAwareness | Form validation, API failure | Inline error messages | Clear error on retry |
| PublicPreparedness | Chat failure, Stream interruption | Chat error message | Maintain chat history |
| OperationsHub | Multiple API failures | Loading states, error banner | Partial data display |
| GeminiService | API limits, Network, Invalid response | Specific error messages | Automatic retry logic |

## Performance Optimization Strategies

### Lazy Loading and Code Splitting

```mermaid
graph TD
    Initial[Initial Bundle<br/>App, Sidebar] --> Route{Route Request}
    Route -->|/awareness| LoadSA[Dynamic Import<br/>SituationalAwareness]
    Route -->|/preparedness| LoadPP[Dynamic Import<br/>PublicPreparedness]
    Route -->|/operations| LoadOH[Dynamic Import<br/>OperationsHub]

    LoadSA --> RenderSA[Render Component]
    LoadPP --> RenderPP[Render Component]
    LoadOH --> CheckState{Has Analysis?}
    CheckState -->|Yes| RenderOH[Render Component]
    CheckState -->|No| Redirect[Redirect to SA]
```

### Caching Strategy

1. **Component Level**: React memo for icons
2. **API Level**: Response caching for repeated queries
3. **State Level**: Persist analysis across navigation
4. **Service Worker**: Offline capability for core features

## Security Architecture

### Security Layers

```mermaid
graph TB
    subgraph "Client Security"
        INPUT[Input Sanitization]
        XSS[XSS Prevention]
        CSRF[CSRF Tokens]
    end

    subgraph "API Security"
        AUTH[API Key Management]
        RATE[Rate Limiting]
        VAL2[Request Validation]
    end

    subgraph "Data Security"
        ENCRYPT[Transit Encryption]
        SANITIZE[Output Sanitization]
        PII[PII Handling]
    end

    INPUT --> VAL2
    VAL2 --> RATE
    RATE --> AUTH
    AUTH --> ENCRYPT
    ENCRYPT --> SANITIZE
    SANITIZE --> XSS
```

## Deployment Architecture

### Production Deployment

```mermaid
graph LR
    subgraph "Build Pipeline"
        Code[Source Code] --> Build[Vite Build]
        Build --> Bundle[Optimized Bundle]
        Bundle --> CDN[CDN Distribution]
    end

    subgraph "Runtime"
        CDN --> Browser[Client Browser]
        Browser --> API[Gemini API]
        API --> Response[AI Response]
        Response --> Browser
    end

    subgraph "Monitoring"
        Browser --> Analytics[Analytics]
        API --> Metrics[API Metrics]
        Response --> Logging[Error Logging]
    end
```

## Scalability Considerations

### Horizontal Scaling Strategy

1. **Stateless Design**: No server-side session state
2. **CDN Distribution**: Static assets globally distributed
3. **API Management**: Google's infrastructure handles AI scaling
4. **Client-Side State**: Reduces server load

### Vertical Scaling Options

1. **Model Selection**: Upgrade to more capable models as needed
2. **Concurrent Requests**: Parallel API calls for Operations Hub
3. **Batch Processing**: Group similar requests when possible
4. **Progressive Enhancement**: Add features without breaking existing

## Future Architecture Enhancements

### Planned Improvements

```mermaid
timeline
    title Architecture Evolution Roadmap

    section Phase 1
        Current State     : React SPA, Gemini Integration, Basic State Management

    section Phase 2
        State Management  : Redux/Zustand for complex state
        Offline Support   : Service Workers, IndexedDB

    section Phase 3
        Backend Services  : Node.js API layer
        Authentication    : Auth0/Firebase Auth
        Database         : PostgreSQL for incident history

    section Phase 4
        Microservices    : Separate services for each feature
        Event Driven     : WebSockets for real-time updates
        Advanced AI      : Fine-tuned models, RAG implementation
```

---

This architecture provides a robust, scalable foundation for the Aegis AI Emergency Management system, with clear separation of concerns, strong type safety, and strategic AI model utilization.