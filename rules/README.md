# Satomi Development Rules

This directory contains comprehensive development guidelines for the Satomi project.

## Overview

Satomi is a backend-focused Next.js application that delivers beautifully explained Japanese cultural concepts through OpenAI integration. These rules ensure consistent, high-quality development practices.

## Rules Documentation

### 1. [Satomi Development Rules](./satomi-development-rules.md)
Project-specific guidelines covering:
- Code organization and structure
- Server actions and API routes
- TypeScript best practices
- Error handling and security
- Japanese cultural guidelines
- Testing and deployment

### 2. [OpenAI Integration Rules](./openai-integration-rules.md)
Comprehensive OpenAI API integration guidelines:
- Configuration and setup
- Model selection criteria
- Prompt engineering best practices
- Error handling and retry logic
- Token management and cost optimization
- Caching strategies

### 3. [Best Practices](./best-practices.md)
General Next.js and TypeScript best practices (existing file)

### 4. [Database Rules](./database-rules.md)
Database operation safety protocols (existing file)

### 5. [General Rules](./general-rules.md)
General development guidelines (existing file)

### 6. [Next.js 16 Guide](./nextjs-16.md)
Next.js 16 specific features and conventions (existing file)

### 7. [Server Action Tutorial](./server-action-tutorial.md)
Detailed server actions implementation guide (existing file)

### 8. [API Route Tutorial](./api-route-tutorial.md)
API route implementation patterns (existing file)

### 9. [Significant Issues](./significant-issues.md)
Common pitfalls and how to avoid them (existing file)

## Quick Reference

### Technology Stack

- **Framework**: Next.js 16+ (App Router)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **AI**: OpenAI API (openai package)
- **Future**: Prisma, Clerk, Tailwind CSS

### Key Principles

1. **Backend-First**: All AI processing happens server-side
2. **Type Safety**: Strict TypeScript throughout
3. **Security**: API keys never exposed to client
4. **Cultural Respect**: Accurate representation of Japanese concepts
5. **Error Handling**: Graceful failure with user-friendly messages
6. **Performance**: Caching and optimization for API calls

### File Structure

```
satomi/
├── app/
│   ├── api/              # API routes
│   │   ├── japanese-concept/
│   │   ├── process-content/
│   │   └── validate-file/
│   └── page.tsx          # App pages
├── lib/
│   ├── actions/          # Server actions
│   │   ├── japanese-concept-action.ts
│   │   └── content-processor-action.ts
│   ├── utils/            # Utility functions
│   │   └── placeholder-detector.ts
│   └── openai.ts         # OpenAI client
├── types/                # TypeScript definitions
├── docs/                 # Documentation
│   ├── README.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── DEPLOYMENT.md
│   └── USAGE.md
└── rules/                # This directory
```

### Common Commands

```bash
# Development
pnpm dev                  # Start dev server
pnpm build                # Build for production
pnpm start                # Start production server
pnpm lint                 # Run linter

# Dependencies
pnpm install              # Install dependencies
pnpm add <package>        # Add package
```

### Environment Variables

Required:
```bash
OPENAI_API_KEY=sk-proj-your-key-here
```

### Code Patterns

#### Server Action Pattern

```typescript
'use server';

export async function actionName(input: InputType): Promise<ResponseType> {
  try {
    // Validate
    const validation = validate(input);
    if (!validation.valid) {
      return { success: false, error: validation.errors.join(', ') };
    }

    // Process
    const result = await process(input);

    // Return
    return { success: true, data: result, timestamp: new Date().toISOString() };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'User-friendly message' };
  }
}
```

#### API Route Pattern

```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate
    if (!body.requiredField) {
      return NextResponse.json(
        { success: false, error: 'Missing required field' },
        { status: 400 }
      );
    }

    // Process
    const result = await serverAction(body);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## Checklist for New Features

- [ ] TypeScript types defined
- [ ] Input validation implemented
- [ ] Placeholder detection applied
- [ ] Error handling in place
- [ ] Server-side processing only
- [ ] Consistent response format
- [ ] Documentation updated
- [ ] Linter passes
- [ ] Tested locally
- [ ] Cultural accuracy verified (if applicable)

## Quick Troubleshooting

### "Invalid API key"
- Check `.env.local` has `OPENAI_API_KEY`
- Verify key starts with `sk-proj-` or `sk-`
- Restart dev server after adding key

### "Content contains placeholders"
- Use `removePlaceholders()` before processing
- Check for `[TODO]`, `{placeholder}`, etc.

### "Rate limit exceeded"
- Implement caching
- Add rate limiting on your end
- Wait and retry with exponential backoff

### TypeScript errors
```bash
pnpm tsc --noEmit        # Check types
pnpm lint                # Run linter
```

## Getting Help

1. Check relevant rule file (above)
2. Review documentation in `/docs`
3. Search issues/discussions
4. Create new issue with:
   - What you're trying to do
   - What error you're getting
   - What you've tried

## Contributing

When adding new features or making changes:

1. Follow existing patterns
2. Update relevant rule files
3. Add documentation
4. Test thoroughly
5. Submit PR with clear description

## Maintenance

These rules should be updated when:
- New patterns emerge
- Common issues are identified
- Technology stack changes
- Best practices evolve

Last updated: November 2025

