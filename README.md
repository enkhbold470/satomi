# Satomi - Japanese Concept Learning Platform

A minimal Next.js backend application built with TypeScript that delivers beautifully explained Japanese cultural concepts through conversational AI powered by OpenAI.

## Overview

Satomi provides a backend infrastructure for processing and explaining traditional Japanese concepts, philosophies, and principles to Western audiences. Each response focuses on a single concept with clear explanations, historical context, and practical applications.

Perfect for building a media brand around Japanese culture, Satomi delivers 3-minute reads with quotable wisdom designed for sharing and audience building.

### Key Features

- **Japanese Concept Explanation**: AI-powered explanations of cultural concepts like Ikigai, Wabi-Sabi, Kaizen, and more
- **OMI Wearable Integration**: Conversational access through OMI AI wearable device
- **Content Processing**: Generic content improvement, summarization, and analysis
- **File Validation**: Automatic placeholder detection for README and LICENSE files
- **Type-Safe Architecture**: Full TypeScript implementation with strict type checking
- **Server Actions**: Backend-only processing using Next.js 16 server actions
- **OpenAI Integration**: Powered by GPT-4o for accurate, nuanced explanations

## Quick Start

### Prerequisites

- Node.js 18.17 or later
- pnpm (package manager)
- OpenAI API key

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd satomi

# Install dependencies
pnpm install

# Set up environment variables
echo "OPENAI_API_KEY=your-api-key-here" > .env.local

# Start development server
pnpm dev
```

### First API Call

```bash
# Test the Japanese concept endpoint
curl -X POST http://localhost:3000/api/japanese-concept \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ikigai?"}'
```

## OMI Wearable Integration 🎙️

Satomi integrates with [OMI AI Wearable](https://www.omi.me) for hands-free, conversational access to Japanese concepts.

✅ **Tested with real OMI device** - Backend handles actual OMI payload structure with segments array!

**Quick Setup:**
1. Deploy Satomi to a public URL
2. Create an OMI integration app
3. Set webhook URL: `https://your-domain.com/api/omi/webhook`
4. Ask OMI: "What is ikigai?"

See [OMI Integration Guide](./docs/OMI_INTEGRATION.md) for complete setup instructions, or [Real Payload Fix](./REAL_OMI_PAYLOAD_FIX.md) for technical details.

## API Endpoints

### 1. Japanese Concept Explanation

```bash
POST /api/japanese-concept

# Request
{
  "query": "Explain the concept of wabi-sabi",
  "conversationHistory": [] // optional
}

# Response
{
  "success": true,
  "concept": {
    "name": "Wabi-Sabi (侘寂)",
    "explanation": "...",
    "origin": "...",
    "application": "...",
    "fullResponse": "..."
  },
  "timestamp": "2025-11-01T12:00:00.000Z"
}
```

### 2. Content Processing

```bash
POST /api/process-content

# Request
{
  "content": "Text to process",
  "processType": "improve", // improve | summarize | analyze | custom
  "filename": "README.md" // optional
}

# Response
{
  "success": true,
  "processedContent": "Enhanced content...",
  "hadPlaceholders": false,
  "timestamp": "2025-11-01T12:00:00.000Z"
}
```

### 3. File Validation

```bash
POST /api/validate-file

# Request
{
  "filename": "README.md",
  "content": "File content to validate"
}

# Response
{
  "valid": true,
  "errors": [],
  "warnings": [],
  "cleanedContent": "..."
}
```

## Usage Examples

### JavaScript/TypeScript

```typescript
// Get concept explanation
async function explainConcept(query: string) {
  const response = await fetch('/api/japanese-concept', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });
  
  const data = await response.json();
  return data.concept;
}

const concept = await explainConcept("What is kaizen?");
console.log(concept.fullResponse);
```

### Python

```python
import requests

def explain_concept(query: str):
    response = requests.post(
        'http://localhost:3000/api/japanese-concept',
        json={'query': query}
    )
    data = response.json()
    return data['concept']

concept = explain_concept("What is mono no aware?")
print(concept['fullResponse'])
```

## Technology Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **AI**: OpenAI API (GPT-4o)
- **Package Manager**: pnpm
- **Runtime**: Node.js 18+

## Project Structure

```
satomi/
├── app/
│   ├── api/                      # API routes
│   │   ├── japanese-concept/     # Concept explanation endpoint
│   │   ├── process-content/      # Content processing endpoint
│   │   └── validate-file/        # File validation endpoint
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── actions/                  # Server actions
│   │   ├── japanese-concept-action.ts
│   │   └── content-processor-action.ts
│   ├── utils/                    # Utilities
│   │   └── placeholder-detector.ts
│   └── openai.ts                 # OpenAI client
├── types/
│   └── index.ts                  # Type definitions
├── docs/                         # Documentation
│   ├── README.md                 # Overview
│   ├── API.md                    # API reference
│   ├── ARCHITECTURE.md           # Technical architecture
│   ├── DEPLOYMENT.md             # Deployment guide
│   └── USAGE.md                  # Usage examples
├── rules/                        # Development rules
│   ├── README.md                 # Rules overview
│   ├── satomi-development-rules.md
│   └── openai-integration-rules.md
└── package.json
```

## Documentation

Comprehensive documentation is available in the `/docs` folder:

- **[API Reference](./docs/API.md)**: Complete API documentation with examples
- **[Architecture](./docs/ARCHITECTURE.md)**: Technical architecture and design decisions
- **[Deployment Guide](./docs/DEPLOYMENT.md)**: Deployment instructions for various platforms
- **[Usage Guide](./docs/USAGE.md)**: Detailed usage examples and patterns

Development rules are in the `/rules` folder:

- **[Development Rules](./rules/satomi-development-rules.md)**: Project-specific guidelines
- **[OpenAI Integration](./rules/openai-integration-rules.md)**: OpenAI best practices

## Environment Variables

Create a `.env.local` file with:

```bash
OPENAI_API_KEY=sk-proj-your-api-key-here
```

## Development Commands

```bash
# Development
pnpm dev              # Start development server
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run linter

# Dependencies
pnpm install          # Install dependencies
pnpm add <package>    # Add new package
```

## Features in Detail

### Placeholder Detection

Automatically detects and removes common placeholder patterns:
- `[placeholder]`, `{TODO}`, `<example>`
- `YOUR_*`, `REPLACE_*`, `FIXME:`
- `example.com`, `lorem ipsum`

### Conversation History

Maintains context across multiple queries:

```typescript
const history = [
  { role: 'user', content: 'What is ikigai?' },
  { role: 'assistant', content: 'Ikigai is...' }
];

const response = await fetch('/api/japanese-concept', {
  method: 'POST',
  body: JSON.stringify({
    query: 'How can I find mine?',
    conversationHistory: history
  })
});
```

### Cultural Accuracy

- Curated by cultural experts
- Includes historical context
- Provides practical applications
- Avoids oversimplification
- Respects Japanese traditions

## Use Cases

1. **Learning Platform**: Build conversational interfaces for cultural education
2. **Content Generation**: Create blog posts, articles, or educational materials
3. **Documentation Validation**: Ensure README/LICENSE files are production-ready
4. **Chatbot Integration**: Power cultural knowledge chatbots
5. **API Backend**: Serve Japanese concept data to frontend applications

## Business Model

- **Free Access**: Open API for concept explanations
- **Monetization**: Advertising, premium features
- **Growth**: Build audience over time
- **Expansion**: Extend to other mediums (podcast, video, courses)

## Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
pnpm add -g vercel

# Deploy
vercel --prod
```

### Docker

```bash
# Build image
docker build -t satomi .

# Run container
docker run -p 3000:3000 -e OPENAI_API_KEY=your-key satomi
```

See [Deployment Guide](./docs/DEPLOYMENT.md) for more options.

## Contributing

Contributions are welcome! Please:

1. Follow the development rules in `/rules`
2. Add tests for new features
3. Update documentation
4. Ensure linter passes
5. Submit PR with clear description

## Roadmap

- [ ] Add response caching (Redis)
- [ ] Implement rate limiting
- [ ] Add database for conversation persistence
- [ ] Create frontend interface
- [ ] Support multiple AI models
- [ ] Add user authentication
- [ ] Implement analytics dashboard
- [ ] Multi-language support

## License

This project is for demonstration and educational purposes.

## Support

- **Documentation**: See `/docs` folder
- **Issues**: Open an issue on GitHub
- **Questions**: Start a discussion

## Acknowledgments

Built with Next.js and powered by OpenAI. Designed to respectfully share Japanese cultural wisdom with Western audiences.

---

**Note**: Make sure to set your `OPENAI_API_KEY` in `.env.local` before starting the development server.
