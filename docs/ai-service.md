# AI Service Architecture - Aegis AI Emergency Management

## Overview

The AI service layer in Aegis provides intelligent analysis and generation capabilities through Google's Gemini AI models. This document details the architecture, patterns, and strategies employed in the AI integration.

## Model Selection Strategy

### Model Comparison and Use Cases

```mermaid
graph TD
    subgraph "Model Selection Logic"
        Decision[Request Type] --> Complex{Complexity?}
        Complex -->|High| ProModel[Gemini 2.5 Pro]
        Complex -->|Low| FlashModel[Gemini 2.5 Flash]

        ProModel --> ProUse[Use Cases:<br/>- Incident Analysis<br/>- Impact Forecasting<br/>- Team Briefings<br/>- Training Scenarios]
        FlashModel --> FlashUse[Use Cases:<br/>- Public Chat<br/>- Simple Q&A<br/>- Quick Responses]
    end
```

### Model Characteristics

| Model | Gemini 2.5 Pro | Gemini 2.5 Flash |
|-------|---------------|------------------|
| **Purpose** | Complex analysis, structured output | Conversational, quick responses |
| **Temperature** | 0.3 (deterministic) | 0.7 (creative) |
| **Response Format** | JSON with schema | Streaming text |
| **Latency** | Higher (~2-5s) | Lower (~0.5-2s) |
| **Cost** | Higher | Lower |
| **Use Case** | Critical analysis | User interaction |

## Service Architecture

### Core Service Structure

```mermaid
classDiagram
    class GeminiService {
        -GoogleGenAI ai
        -string proModel
        -string flashModel
        -analysisSchema
        -impactForecastSchema
        -teamBriefingSchema
        -trainingScenarioSchema
        +getIncidentAnalysis(details)
        +generateImpactForecast(details)
        +generateTeamBriefing(analysis)
        +generateTrainingScenario(details)
        +createPreparednessChat()
        -generateJson(model, prompt, schema)
    }

    class GoogleGenAI {
        +models
        +chats
        +generateContent(config)
        +create(config)
    }

    class JSONSchema {
        +type
        +properties
        +required
        +validate()
    }

    GeminiService --> GoogleGenAI : uses
    GeminiService --> JSONSchema : validates with
```

### Service Method Flow

```mermaid
sequenceDiagram
    participant Component
    participant Service as GeminiService
    participant Generator as generateJson
    participant AI as Gemini AI
    participant Schema as Schema Validator

    Component->>Service: getIncidentAnalysis(details)
    Service->>Service: Build prompt
    Service->>Generator: generateJson(pro, prompt, schema)
    Generator->>AI: generateContent({model, prompt, schema})
    AI-->>Generator: JSON response
    Generator->>Schema: Validate against schema
    Schema-->>Generator: Validated object
    Generator-->>Service: Typed result
    Service-->>Component: AnalysisResult

    Note over Generator,Schema: Error handling at each step
```

## JSON Schema Validation

### Schema Definition Pattern

```typescript
// Analysis Schema Structure
const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        summary: {
            type: Type.STRING,
            description: "Brief, concise incident summary"
        },
        recommendedActions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Immediate actionable steps"
        },
        potentialRisks: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Secondary risks/cascading effects"
        },
        resourceSuggestions: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Suggested resources to allocate"
        }
    },
    required: ["summary", "recommendedActions", "potentialRisks", "resourceSuggestions"]
}
```

### Schema Validation Flow

```mermaid
flowchart TD
    Start[AI Response] --> Parse{Parse JSON}
    Parse -->|Success| Validate{Validate Schema}
    Parse -->|Fail| ParseError[Parse Error]

    Validate -->|Valid| CheckReq{Required Fields?}
    Validate -->|Invalid| SchemaError[Schema Error]

    CheckReq -->|All Present| TypeCheck{Type Check}
    CheckReq -->|Missing| MissingError[Missing Fields Error]

    TypeCheck -->|Pass| Return[Return Typed Object]
    TypeCheck -->|Fail| TypeError[Type Error]

    ParseError --> HandleError[Error Handler]
    SchemaError --> HandleError
    MissingError --> HandleError
    TypeError --> HandleError

    HandleError --> UserError[User-Friendly Message]
```

### Schema Types and Validation Rules

```mermaid
graph TD
    subgraph "Impact Forecast Schema"
        IF[ImpactForecast] --> SH[shortTermImpacts: string[]]
        IF --> LH[longTermImpacts: string[]]
        IF --> CL[communityLifelines: object[]]
        CL --> LL[lifeline: string]
        CL --> IM[impact: string]
        CL --> MIT[mitigation: string]
    end

    subgraph "Team Briefing Schema"
        TB[TeamBriefing] --> MS[missionStatement: string]
        TB --> KO[keyObjectives: string[]]
        TB --> KR[knownRisks: string[]]
        TB --> CP[commsPlan: string]
    end

    subgraph "Training Scenario Schema"
        TS[TrainingScenario] --> ST[scenarioTitle: string]
        TS --> LO[learningObjectives: string[]]
        TS --> IB[initialBriefing: string]
        TS --> TI[timelineInjects: object[]]
        TI --> TM[time: string]
        TI --> EV[event: string]
        TI --> EA[expectedAction: string]
    end
```

## Streaming vs Structured Responses

### Response Pattern Comparison

```mermaid
flowchart LR
    subgraph "Structured Response (Pro Model)"
        SR1[Request] --> SR2[Complete Processing]
        SR2 --> SR3[JSON Response]
        SR3 --> SR4[Parse & Validate]
        SR4 --> SR5[Display All]
    end

    subgraph "Streaming Response (Flash Model)"
        ST1[Request] --> ST2[Start Stream]
        ST2 --> ST3[Chunk 1]
        ST3 --> ST4[Display Chunk 1]
        ST4 --> ST5[Chunk 2]
        ST5 --> ST6[Display Chunk 2]
        ST6 --> ST7[...]
        ST7 --> ST8[Complete]
    end
```

### Streaming Implementation

```typescript
// Streaming chat response pattern
async function handleStreamingResponse(chat: Chat, message: string) {
    const stream = await chat.sendMessageStream({ message });
    let fullResponse = '';

    for await (const chunk of stream) {
        fullResponse += chunk.text;
        // Progressive UI update
        updateUIWithChunk(fullResponse);
    }

    return fullResponse;
}
```

### Structured Response Implementation

```typescript
// Structured JSON response pattern
async function generateJson<T>(
    model: string,
    prompt: string,
    schema: object
): Promise<T> {
    const response = await ai.models.generateContent({
        model: model,
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: schema,
            temperature: 0.3,
        }
    });

    const jsonText = response.text.trim();
    return JSON.parse(jsonText) as T;
}
```

## Prompt Engineering Strategies

### Prompt Construction Pattern

```mermaid
graph TD
    subgraph "Prompt Components"
        Context[Context Setting] --> Role[Role Definition]
        Role --> Task[Task Description]
        Task --> Data[Input Data]
        Data --> Format[Output Format]
        Format --> Constraints[Constraints/Rules]
    end

    subgraph "Example Prompt"
        Ex1[Analyze the following emergency incident]
        Ex2[Incident Type: Natural Disaster]
        Ex3[Location: Eastern District]
        Ex4[Severity: High]
        Ex5[Description: Wildfire spreading...]
        Ex6[Provide structured response with actions]
    end
```

### Prompt Templates

```typescript
// Incident Analysis Prompt
const analysisPrompt = `
Analyze the following emergency incident report and provide a structured response.
Incident Type: ${details.incidentType}
Location: ${details.location}
Severity: ${details.severity}
Description: ${details.description}
`;

// Impact Forecast Prompt
const forecastPrompt = `
Generate a detailed impact forecast for this incident:
Incident Type: ${details.incidentType}
Location: ${details.location}
Severity: ${details.severity}
Description: ${details.description}
Focus on short-term, long-term, and community lifeline impacts.
`;

// Team Briefing Prompt
const briefingPrompt = `
Based on the following incident analysis, create a standardized
operational team briefing (ICS style).
Analysis: ${JSON.stringify(analysis)}
The briefing must be clear, concise, and actionable for first responders.
`;
```

## Error Handling and Recovery

### Error Handling Flow

```mermaid
stateDiagram-v2
    [*] --> Request: API Call
    Request --> Processing: Normal Flow
    Processing --> Success: Valid Response
    Processing --> APIError: API Failure
    Processing --> ParseError: Invalid JSON
    Processing --> SchemaError: Schema Mismatch
    Processing --> RateLimit: Rate Limited

    APIError --> Retry: Retry Logic
    ParseError --> Fallback: Fallback Response
    SchemaError --> Reformat: Reformat Request
    RateLimit --> Backoff: Exponential Backoff

    Retry --> Processing: Retry Attempt
    Retry --> UserError: Max Retries
    Fallback --> UserError: Show Error
    Reformat --> Processing: New Attempt
    Backoff --> Wait: Wait Period
    Wait --> Processing: Resume

    Success --> [*]: Complete
    UserError --> [*]: Error Shown
```

### Error Types and Handling

| Error Type | Cause | Handling Strategy | User Feedback |
|------------|-------|-------------------|---------------|
| API Timeout | Network/Server | Retry with backoff | "Processing taking longer than usual..." |
| Rate Limit | Too many requests | Queue and delay | "High demand, please wait..." |
| Invalid JSON | Malformed response | Request regeneration | "Reformatting response..." |
| Schema Mismatch | Missing fields | Default values | "Partial results available" |
| Authentication | Invalid API key | Check configuration | "Configuration error" |

## Performance Optimization

### Optimization Strategies

```mermaid
graph TD
    subgraph "Request Optimization"
        RO1[Batch Similar Requests] --> RO2[Cache Common Responses]
        RO2 --> RO3[Preload Frequent Queries]
    end

    subgraph "Response Optimization"
        RS1[Stream for UX] --> RS2[Progressive Rendering]
        RS2 --> RS3[Debounce Updates]
    end

    subgraph "Model Optimization"
        MO1[Right-size Model Selection] --> MO2[Optimize Temperature]
        MO2 --> MO3[Minimize Token Usage]
    end
```

### Performance Metrics

```typescript
// Performance monitoring pattern
interface PerformanceMetrics {
    requestTime: number;
    responseTime: number;
    tokenCount: number;
    modelUsed: string;
    cacheHit: boolean;
}

async function monitoredRequest<T>(
    operation: () => Promise<T>
): Promise<[T, PerformanceMetrics]> {
    const startTime = performance.now();
    const result = await operation();
    const endTime = performance.now();

    const metrics: PerformanceMetrics = {
        requestTime: endTime - startTime,
        responseTime: /* extract from response */,
        tokenCount: /* extract from response */,
        modelUsed: /* model identifier */,
        cacheHit: /* check cache */
    };

    return [result, metrics];
}
```

## Advanced Patterns

### Parallel Request Processing

```mermaid
sequenceDiagram
    participant OH as OperationsHub
    participant S as Service
    participant AI as Gemini AI

    OH->>S: Request All Data
    par Impact Forecast
        S->>AI: generateImpactForecast()
        AI-->>S: Forecast Data
    and Team Briefing
        S->>AI: generateTeamBriefing()
        AI-->>S: Briefing Data
    and Training Scenario
        S->>AI: generateTrainingScenario()
        AI-->>S: Scenario Data
    end
    S-->>OH: Combined Results
```

### Context Management for Chat

```typescript
// Chat context management
class ChatContextManager {
    private systemInstruction = `
        You are an expert in emergency preparedness and public safety.
        Your role is to provide clear, concise, and actionable advice.
        Answer questions about creating emergency kits, evacuation plans,
        and safety procedures for various disasters.
        Be calm, reassuring, and authoritative.
        Use lists and simple language.
    `;

    private messageHistory: ChatMessage[] = [];

    addMessage(message: ChatMessage) {
        this.messageHistory.push(message);
        // Maintain sliding window of context
        if (this.messageHistory.length > 20) {
            this.messageHistory = this.messageHistory.slice(-20);
        }
    }

    getContext(): string {
        return this.messageHistory
            .map(m => `${m.sender}: ${m.text}`)
            .join('\n');
    }
}
```

## Security Considerations

### AI Service Security

```mermaid
graph TD
    subgraph "Input Security"
        IS1[Input Sanitization] --> IS2[Length Validation]
        IS2 --> IS3[Content Filtering]
    end

    subgraph "API Security"
        AS1[API Key Rotation] --> AS2[Rate Limiting]
        AS2 --> AS3[Request Signing]
    end

    subgraph "Output Security"
        OS1[Response Validation] --> OS2[PII Filtering]
        OS2 --> OS3[Content Moderation]
    end

    IS3 --> AS1
    AS3 --> OS1
```

### Security Best Practices

1. **API Key Management**
   - Environment variables only
   - Never expose in client code
   - Regular rotation schedule

2. **Input Validation**
   - Sanitize user inputs
   - Enforce character limits
   - Block malicious patterns

3. **Output Validation**
   - Verify response structure
   - Filter sensitive information
   - Moderate generated content

## Future Enhancements

### Planned Improvements

```mermaid
timeline
    title AI Service Evolution

    section Current
        Basic Integration : Gemini Pro/Flash
        JSON Schemas     : Structured responses
        Streaming Chat   : Real-time interaction

    section Next Phase
        Fine-tuning     : Domain-specific models
        RAG Integration : Knowledge base
        Multi-modal     : Image/document analysis

    section Future
        Custom Models   : Trained on incident data
        Predictive AI   : Incident forecasting
        Agent Systems   : Autonomous planning
```

### Advanced Capabilities Roadmap

1. **Retrieval-Augmented Generation (RAG)**
   - Historical incident database
   - Local regulations and procedures
   - Best practices repository

2. **Multi-Modal Analysis**
   - Incident photo analysis
   - Map and diagram interpretation
   - Document processing

3. **Predictive Intelligence**
   - Pattern recognition across incidents
   - Resource optimization suggestions
   - Outcome probability modeling

---

This AI service architecture provides a robust, scalable foundation for intelligent emergency management capabilities, with clear patterns for both structured analysis and interactive assistance.