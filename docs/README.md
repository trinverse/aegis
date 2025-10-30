# Aegis AI Emergency Management - Documentation

## 🚀 Overview

Aegis AI Emergency Management is an advanced emergency response system that leverages Google's Gemini AI models to provide real-time incident analysis, public preparedness guidance, and operational intelligence for emergency management professionals.

## 📚 Documentation Index

### Core Documentation

1. **[Architecture Documentation](./architecture.md)**
   - System architecture overview with detailed diagrams
   - Component hierarchy and relationships
   - State management patterns
   - Navigation flow and guards

2. **[Use Cases](./use-cases.md)**
   - Detailed scenarios for all three main features
   - User personas and their journeys
   - Business value propositions

3. **[AI Service Architecture](./ai-service.md)**
   - Deep dive into AI integration
   - Model selection strategies (Pro vs Flash)
   - JSON schema validation patterns
   - Streaming vs structured responses

4. **[Data Models](./data-models.md)**
   - TypeScript interfaces and their relationships
   - Entity relationship diagrams
   - Data flow documentation

5. **[User Flows](./user-flows.md)**
   - Detailed user journey diagrams
   - Interaction patterns
   - State transitions

6. **[Deployment Guide](./deployment.md)**
   - Environment setup
   - Configuration management
   - Production deployment strategies

## 🏗️ System Overview

### Key Features

1. **Situational Awareness**
   - Real-time incident reporting
   - AI-powered analysis using Gemini Pro
   - Risk assessment and resource recommendations

2. **Public Preparedness**
   - Interactive chat interface
   - Emergency preparedness guidance
   - Powered by Gemini Flash for efficiency

3. **Operations Hub**
   - Impact forecasting
   - Team briefing generation
   - Training scenario creation
   - Advanced operational intelligence

### Technology Stack

- **Frontend**: React 19 with TypeScript
- **Build Tool**: Vite
- **AI Service**: Google Gemini AI (Pro & Flash models)
- **Styling**: Tailwind CSS
- **State Management**: React Hooks (useState)

### Key Design Principles

1. **Progressive Disclosure**: Users must complete incident analysis before accessing advanced operations
2. **Model Optimization**: Strategic use of Pro (complex) vs Flash (simple) models
3. **Streaming UX**: Real-time response streaming for chat interactions
4. **Structured Data**: JSON schema validation for predictable AI outputs
5. **Responsive Design**: Mobile-first approach with adaptive layouts

## 🚦 Quick Start

### Prerequisites

- Node.js 18+ and npm
- Google AI API Key (Gemini access)
- Modern web browser

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd aegis

# Install dependencies
npm install

# Set up environment variables
export API_KEY="your-google-ai-api-key"

# Start development server
npm run dev
```

## 📊 Project Structure

```
aegis/
├── components/
│   ├── SituationalAwareness.tsx  # Incident reporting and analysis
│   ├── PublicPreparedness.tsx    # Chat-based preparedness guide
│   ├── OperationsHub.tsx         # Advanced operational tools
│   ├── Sidebar.tsx               # Navigation with state guards
│   └── icons/                    # Custom icon components
├── services/
│   └── geminiService.ts          # AI integration layer
├── types.ts                      # TypeScript interfaces
├── App.tsx                       # Main application component
├── index.tsx                     # Application entry point
└── docs/                         # Comprehensive documentation
```

## 🔒 Security Considerations

- API keys should never be committed to version control
- Implement rate limiting for production deployments
- Validate all user inputs before AI processing
- Consider implementing authentication for operational features

## 🤝 Contributing

Please refer to the architecture and data model documentation before making contributions. Ensure all new features maintain the existing design patterns and include appropriate TypeScript types.

## 📄 License

[License information to be added]

---

For detailed information on any aspect of the system, please refer to the specific documentation files linked above.