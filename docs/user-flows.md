# User Flows Documentation - Aegis AI Emergency Management

## Overview

This document provides detailed user journey diagrams and interaction flows for all features within the Aegis system, illustrating how users navigate and interact with the application.

## Primary User Flow - Complete Incident Response

```mermaid
flowchart TD
    Start([User Opens Aegis]) --> Landing[Situational Awareness View]
    Landing --> Decision{User Action?}

    Decision -->|Report Incident| FillForm[Fill Incident Form]
    Decision -->|Get Preparedness Info| PrepChat[Public Preparedness Chat]
    Decision -->|View Operations| BlockedOps[Operations Blocked<br/>No Analysis]

    FillForm --> Validate{Form Valid?}
    Validate -->|No| ShowErrors[Show Validation Errors]
    ShowErrors --> FillForm
    Validate -->|Yes| Submit[Submit for Analysis]

    Submit --> Loading[Show Loading State]
    Loading --> AIProcess[AI Processing<br/>Gemini Pro]
    AIProcess --> Success{Analysis Success?}

    Success -->|Yes| DisplayAnalysis[Display Analysis Results]
    Success -->|No| ErrorState[Show Error Message]
    ErrorState --> Retry{Retry?}
    Retry -->|Yes| Submit
    Retry -->|No| FillForm

    DisplayAnalysis --> UnlockOps[Enable Operations Hub]
    UnlockOps --> UserChoice{Next Action?}

    UserChoice -->|View Operations| NavigateOps[Navigate to Operations Hub]
    UserChoice -->|New Incident| ClearState[Clear Current Analysis]
    UserChoice -->|Stay| ReviewAnalysis[Review Analysis Details]

    NavigateOps --> LoadOps[Load Operations Data]
    LoadOps --> DisplayOps[Display All Tools]

    ClearState --> FillForm
    ReviewAnalysis --> UserChoice

    PrepChat --> ChatInteraction[Chat with AI]
    ChatInteraction --> PrepChat
```

## Feature 1: Situational Awareness User Flow

### Detailed Incident Reporting Flow

```mermaid
flowchart TD
    Entry([User Enters SA]) --> InitialState[Empty Form State]

    InitialState --> SelectType[Select Incident Type]
    SelectType --> TypeSelected{Type Selected}
    TypeSelected -->|Natural Disaster| ND[Update State: Natural Disaster]
    TypeSelected -->|Tech Accident| TA[Update State: Tech Accident]
    TypeSelected -->|Terrorism| TR[Update State: Terrorism]
    TypeSelected -->|Public Health| PH[Update State: Public Health]
    TypeSelected -->|Other| OT[Update State: Other]

    ND --> EnterLocation
    TA --> EnterLocation
    TR --> EnterLocation
    PH --> EnterLocation
    OT --> EnterLocation

    EnterLocation[Enter Location] --> LocationValidate{Valid Location?}
    LocationValidate -->|Empty| LocError[Show: Location Required]
    LocationValidate -->|Valid| SelectSeverity
    LocError --> EnterLocation

    SelectSeverity[Select Severity Level] --> SevSelected{Level?}
    SevSelected -->|Low| Low[State: Low Impact]
    SevSelected -->|Moderate| Mod[State: Moderate Impact]
    SevSelected -->|High| High[State: High Impact]
    SevSelected -->|Severe| Sev[State: Severe Impact]
    SevSelected -->|Catastrophic| Cat[State: Catastrophic]

    Low --> EnterDesc
    Mod --> EnterDesc
    High --> EnterDesc
    Sev --> EnterDesc
    Cat --> EnterDesc

    EnterDesc[Enter Description] --> DescValidate{Valid Description?}
    DescValidate -->|Too Short| DescError[Show: Min 10 characters]
    DescValidate -->|Valid| EnableSubmit[Enable Submit Button]
    DescError --> EnterDesc

    EnableSubmit --> UserSubmit{User Submits?}
    UserSubmit -->|Yes| SubmitFlow[Process Submission]
    UserSubmit -->|No| EnableSubmit

    SubmitFlow --> ShowLoading[Display Loading Spinner]
    ShowLoading --> CallAPI[Call Gemini Service]
    CallAPI --> Response{Response Status}

    Response -->|Success| ParseJSON[Parse JSON Response]
    Response -->|Error| HandleError[Handle Error]

    ParseJSON --> ValidateSchema{Schema Valid?}
    ValidateSchema -->|Yes| DisplayResults[Display Analysis]
    ValidateSchema -->|No| SchemaError[Log Error & Retry]

    DisplayResults --> ShowNav[Show Operations Button]
    ShowNav --> Complete([Analysis Complete])

    HandleError --> UserError[Show User Error]
    UserError --> RetryOption[Show Retry Button]
    SchemaError --> RetryOption
```

### Analysis Display Flow

```mermaid
flowchart LR
    Results[Analysis Results] --> Summary[Display Summary]
    Summary --> Actions[List Recommended Actions]
    Actions --> Risks[Show Potential Risks]
    Risks --> Resources[Display Resource Suggestions]
    Resources --> NavPrompt[Show Operations Hub CTA]

    style Summary fill:#ffd700
    style Actions fill:#90ee90
    style Risks fill:#ff6b6b
    style Resources fill:#87ceeb
    style NavPrompt fill:#9370db
```

## Feature 2: Public Preparedness User Flow

### Chat Interaction Flow

```mermaid
sequenceDiagram
    participant User
    participant UI as Chat Interface
    participant State as Component State
    participant Service as Gemini Service
    participant AI as Gemini Flash

    User->>UI: Opens Public Preparedness
    UI->>State: Initialize chat state
    State->>Service: createPreparednessChat()
    Service->>AI: Initialize chat session
    AI-->>Service: Chat instance
    Service-->>State: Store chat reference
    State-->>UI: Show welcome message

    Note over UI: Display suggested questions

    alt User clicks suggestion
        User->>UI: Click suggested question
        UI->>State: Set userInput
    else User types custom
        User->>UI: Type message
        UI->>State: Update userInput
    end

    User->>UI: Submit message
    UI->>State: Add user message to history
    State->>UI: Display user message
    UI->>State: Set loading = true
    State->>Service: sendMessageStream(message)
    Service->>AI: Stream request

    loop Streaming chunks
        AI-->>Service: Text chunk
        Service-->>State: Append to response
        State-->>UI: Update display progressively
    end

    AI-->>Service: Stream complete
    Service-->>State: Final message
    State->>State: Add to history
    State->>UI: Display complete response
    UI->>State: Set loading = false

    Note over UI: Ready for next message
```

### Chat State Management Flow

```mermaid
stateDiagram-v2
    [*] --> Initializing: Component Mount
    Initializing --> Ready: Chat Created

    Ready --> UserTyping: User Input
    UserTyping --> Ready: Clear Input
    UserTyping --> Sending: Submit Message

    Sending --> Processing: Add to History
    Processing --> Streaming: Receive Chunks
    Streaming --> Streaming: Update Display
    Streaming --> Complete: Stream End
    Complete --> Ready: Show Response

    Ready --> Error: API Error
    Error --> Ready: Retry/Clear

    Ready --> [*]: Component Unmount
```

## Feature 3: Operations Hub User Flow

### Operations Hub Loading Flow

```mermaid
flowchart TD
    Enter([Enter Operations Hub]) --> CheckData{Has Analysis Data?}

    CheckData -->|No| ShowMessage[Display: No Analysis Available]
    ShowMessage --> Prompt[Prompt: Go to Situational Awareness]
    Prompt --> Exit([Redirect to SA])

    CheckData -->|Yes| InitLoad[Initialize Loading State]
    InitLoad --> Parallel{Parallel API Calls}

    Parallel --> Call1[generateImpactForecast]
    Parallel --> Call2[generateTeamBriefing]
    Parallel --> Call3[generateTrainingScenario]

    Call1 --> R1{Response 1}
    Call2 --> R2{Response 2}
    Call3 --> R3{Response 3}

    R1 -->|Success| Store1[Store Forecast]
    R1 -->|Error| Error1[Log Error 1]

    R2 -->|Success| Store2[Store Briefing]
    R2 -->|Error| Error2[Log Error 2]

    R3 -->|Success| Store3[Store Scenario]
    R3 -->|Error| Error3[Log Error 3]

    Store1 --> CheckComplete
    Store2 --> CheckComplete
    Store3 --> CheckComplete
    Error1 --> CheckComplete
    Error2 --> CheckComplete
    Error3 --> CheckComplete

    CheckComplete{All Complete?} -->|Yes| DisplayAll[Display All Sections]
    CheckComplete -->|No| Wait[Wait for Remaining]
    Wait --> CheckComplete

    DisplayAll --> Interactive[User Can Interact]
    Interactive --> Action{User Action?}

    Action -->|View Details| Expand[Expand Section]
    Action -->|Export| Export[Export Data]
    Action -->|New Incident| Clear[Clear State]
    Action -->|Navigate| ChangeView[Change View]

    Expand --> Interactive
    Export --> Downloaded[Download File]
    Downloaded --> Interactive
    Clear --> Exit2([Go to SA])
    ChangeView --> Exit3([Navigate])
```

### Operations Data Display Flow

```mermaid
flowchart LR
    subgraph "Impact Forecast Display"
        IF[Forecast Data] --> ST[Short-term Tab]
        IF --> LT[Long-term Tab]
        IF --> CL[Lifelines Grid]

        CL --> CL1[Energy Card]
        CL --> CL2[Water Card]
        CL --> CL3[Transport Card]
        CL --> CL4[Comms Card]
    end

    subgraph "Team Briefing Display"
        TB[Briefing Data] --> MS[Mission Statement]
        MS --> OBJ[Objectives List]
        OBJ --> RISK[Risks Section]
        RISK --> COMM[Comms Plan]
    end

    subgraph "Training Scenario Display"
        TS[Scenario Data] --> Title[Scenario Title]
        Title --> Learn[Learning Objectives]
        Learn --> Brief[Initial Briefing]
        Brief --> Timeline[Timeline View]

        Timeline --> T1[T+00:00 Event]
        Timeline --> T2[T+15:00 Event]
        Timeline --> T3[T+30:00 Event]
        Timeline --> TN[T+XX:XX Event]
    end
```

## Cross-Feature Navigation Flows

### Navigation State Machine

```mermaid
stateDiagram-v2
    [*] --> SituationalAwareness: Initial Load

    SituationalAwareness --> PublicPreparedness: Direct Navigation
    PublicPreparedness --> SituationalAwareness: Direct Navigation

    SituationalAwareness --> AnalysisComplete: Submit Incident
    AnalysisComplete --> OperationsHub: Navigation Enabled
    OperationsHub --> SituationalAwareness: New Incident
    OperationsHub --> PublicPreparedness: Direct Navigation

    PublicPreparedness --> BlockedOps: Attempt Navigation
    BlockedOps --> PublicPreparedness: Blocked

    state SituationalAwareness {
        [*] --> EmptyForm
        EmptyForm --> FilledForm: User Input
        FilledForm --> Processing: Submit
        Processing --> ShowAnalysis: Success
        Processing --> EmptyForm: Error
    }

    state OperationsHub {
        [*] --> Loading
        Loading --> DisplayTools: Data Loaded
        DisplayTools --> Interacting: User Actions
    }

    state PublicPreparedness {
        [*] --> ChatReady
        ChatReady --> Chatting: Messages
        Chatting --> ChatReady: Continue
    }
```

## Error Handling Flows

### Comprehensive Error Flow

```mermaid
flowchart TD
    Action([User Action]) --> Try{Try Operation}

    Try -->|Success| Continue[Continue Flow]
    Try -->|Network Error| NetErr[Network Error Handler]
    Try -->|API Error| APIErr[API Error Handler]
    Try -->|Validation Error| ValErr[Validation Error Handler]
    Try -->|Unknown Error| UnkErr[Unknown Error Handler]

    NetErr --> NetMsg[Show: Check connection]
    APIErr --> APIMsg[Show: Service unavailable]
    ValErr --> ValMsg[Show: Invalid input]
    UnkErr --> UnkMsg[Show: Something went wrong]

    NetMsg --> Retry{Offer Retry?}
    APIMsg --> Retry
    ValMsg --> Fix[User Fixes Input]
    UnkMsg --> Retry

    Retry -->|Yes| RetryBtn[Show Retry Button]
    Retry -->|No| Fallback[Show Alternative]

    RetryBtn --> UserRetry{User Clicks?}
    UserRetry -->|Yes| Action
    UserRetry -->|No| End([End])

    Fix --> Action
    Fallback --> End
    Continue --> Success([Success])
```

## Mobile Responsive Flow

### Adaptive UI Flow

```mermaid
flowchart TD
    Load([Page Load]) --> Detect{Screen Size?}

    Detect -->|Mobile < 768px| Mobile[Mobile Layout]
    Detect -->|Tablet 768-1024px| Tablet[Tablet Layout]
    Detect -->|Desktop > 1024px| Desktop[Desktop Layout]

    Mobile --> MobileNav[Collapsed Sidebar]
    Mobile --> MobileForms[Full Width Forms]
    Mobile --> MobileCards[Stacked Cards]

    Tablet --> TabletNav[Icon Sidebar]
    Tablet --> TabletForms[Responsive Forms]
    Tablet --> TabletCards[2-Column Grid]

    Desktop --> DesktopNav[Full Sidebar]
    Desktop --> DesktopForms[2-Column Layout]
    Desktop --> DesktopCards[3-Column Grid]

    MobileNav --> Hamburger{Menu Toggle?}
    Hamburger -->|Open| Overlay[Navigation Overlay]
    Hamburger -->|Close| MobileNav
```

## Performance Optimization Flows

### Lazy Loading Flow

```mermaid
flowchart TD
    AppStart([App Start]) --> LoadCore[Load Core Bundle]
    LoadCore --> ShowUI[Initial UI Render]

    ShowUI --> UserNav{User Navigates}

    UserNav -->|To Operations| CheckOps{Ops Loaded?}
    CheckOps -->|No| LoadOps[Dynamic Import Operations]
    CheckOps -->|Yes| ShowOps[Show Operations]
    LoadOps --> ShowOps

    UserNav -->|To Preparedness| CheckPrep{Prep Loaded?}
    CheckPrep -->|No| LoadPrep[Dynamic Import Preparedness]
    CheckPrep -->|Yes| ShowPrep[Show Preparedness]
    LoadPrep --> ShowPrep
```

### Data Caching Flow

```mermaid
flowchart TD
    Request([Data Request]) --> CheckCache{In Cache?}

    CheckCache -->|Yes| CheckFresh{Is Fresh?}
    CheckCache -->|No| FetchNew[Fetch from API]

    CheckFresh -->|Yes < 5min| UseCache[Use Cached Data]
    CheckFresh -->|No > 5min| FetchNew

    FetchNew --> Success{API Success?}
    Success -->|Yes| UpdateCache[Update Cache]
    Success -->|No| CheckStale{Has Stale Cache?}

    UpdateCache --> ReturnData[Return Fresh Data]
    CheckStale -->|Yes| UseStale[Use Stale Data]
    CheckStale -->|No| ShowError[Show Error]

    UseCache --> Display([Display Data])
    ReturnData --> Display
    UseStale --> Display
    ShowError --> Retry([Offer Retry])
```

## Accessibility Flows

### Keyboard Navigation Flow

```mermaid
flowchart TD
    Start([Focus on Page]) --> Tab{Tab Key}

    Tab --> Sidebar[Focus Sidebar Nav]
    Sidebar --> Tab1{Tab}
    Tab1 --> MainContent[Focus Main Content]
    MainContent --> Tab2{Tab}
    Tab2 --> Form[Focus Form Fields]

    Form --> Enter{Enter Key}
    Enter -->|In Input| Nothing[No Action]
    Enter -->|On Button| Submit[Submit Form]

    Form --> Escape{Escape Key}
    Escape --> ClearFocus[Clear Focus]

    Sidebar --> Arrow{Arrow Keys}
    Arrow -->|Up/Down| NavItems[Navigate Menu Items]
    NavItems --> Space{Space/Enter}
    Space --> Navigate[Change View]
```

## Best Practices for User Flow Design

### Flow Design Principles

1. **Progressive Disclosure**: Show only necessary information at each step
2. **Clear Feedback**: Every action has visible response
3. **Error Prevention**: Validate before errors occur
4. **Recovery Options**: Always provide way to recover from errors
5. **Consistent Patterns**: Similar actions have similar flows

### User Flow Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Task Completion Rate | > 90% | Successful analysis creation |
| Error Recovery Rate | > 80% | Users who retry after error |
| Time to Analysis | < 2 min | Form start to results |
| Navigation Success | > 95% | Reach intended destination |
| Chat Satisfaction | > 85% | Helpful response rate |

---

These comprehensive user flows ensure intuitive navigation and interaction patterns throughout the Aegis system, supporting both emergency professionals and public users effectively.