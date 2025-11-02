# Satomi Development Rules

Project-specific development guidelines for the Satomi Japanese Concept Learning Platform.

## Project Overview

Satomi is a backend-focused Next.js application that delivers beautifully explained Japanese cultural concepts through OpenAI integration. The platform emphasizes accuracy, clarity, and respect for Japanese culture.

## Technology Stack

### Required Technologies

- **Framework**: Next.js 16+ (App Router only)
- **Language**: TypeScript (strict mode)
- **Package Manager**: pnpm
- **AI Integration**: OpenAI API (openai package)
- **Runtime**: Node.js 18.17+

### Allowed Additions

- **Database**: Serverless Postgres (Neon) with Prisma ORM
- **Authentication**: Clerk
- **Styling**: Tailwind CSS, Shadcn, Aceternity
- **Icons**: lucide-react

### Forbidden

- No client-side AI processing
- No API key exposure to client
- No database operations outside Prisma
- No direct database migrations without review

## Code Organization

### Directory Structure

```
satomi/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   └── (pages)/           # Page routes (if needed)
├── lib/                   # Core business logic
│   ├── actions/          # Server actions
│   ├── utils/            # Utility functions
│   └── openai.ts         # OpenAI client
├── types/                # TypeScript definitions
├── docs/                 # Project documentation
└── rules/                # Development rules
```

### File Naming Conventions

- Server actions: `*-action.ts`
- API routes: `route.ts`
- Utilities: `*.ts` (descriptive names)
- Types: `index.ts` or `types.ts`
- Components: `PascalCase.tsx` (if frontend added)

## Server Actions

### Guidelines

1. **Always use `'use server'` directive** at the top of server action files
2. **Validate all inputs** before processing
3. **Remove placeholders** before sending to OpenAI
4. **Return structured responses** with consistent format
5. **Handle errors gracefully** with descriptive messages
6. **Never expose API keys** or sensitive data

### Example Structure

```typescript
'use server';

import { validate } from '@/lib/utils/validation';

export async function actionName(input: InputType): Promise<ResponseType> {
  try {
    // 1. Validate input
    const validation = validate(input);
    if (!validation.valid) {
      return {
        success: false,
        error: validation.errors.join(', '),
        timestamp: new Date().toISOString(),
      };
    }

    // 2. Process data
    const result = await processData(input);

    // 3. Return structured response
    return {
      success: true,
      data: result,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in actionName:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
  }
}
```

## API Routes

### Guidelines

1. **Use Next.js 16 App Router conventions**
2. **Export named functions** (GET, POST, etc.)
3. **Validate request bodies**
4. **Return consistent JSON responses**
5. **Use appropriate HTTP status codes**
6. **Log errors server-side only**

### Response Format

```typescript
// Success
{
  success: true,
  data: any,
  timestamp: string
}

// Error
{
  success: false,
  error: string,
  timestamp: string
}
```

### Status Codes

- `200`: Success
- `400`: Bad Request (invalid input)
- `401`: Unauthorized (if auth added)
- `429`: Too Many Requests (if rate limiting added)
- `500`: Internal Server Error

## OpenAI Integration

### Best Practices

1. **Centralize OpenAI client** in `lib/openai.ts`
2. **Use environment variables** for API key
3. **Set reasonable timeouts** (30 seconds recommended)
4. **Implement retry logic** (max 3 retries)
5. **Monitor token usage**
6. **Use appropriate models**:
   - Default: `gpt-4o` (balanced cost/performance)
   - Detailed: `gpt-4` (higher accuracy)
   - Fast: `gpt-3.5-turbo` (lower cost)

### Prompt Engineering

#### Japanese Concept Prompts

- **Be specific**: Request structured output
- **Set context**: Explain target audience (Western)
- **Define format**: Specify sections (meaning, origin, application)
- **Ensure accuracy**: Emphasize cultural respect
- **Encourage engagement**: Request quotable wisdom

#### System Prompt Template

```typescript
const SYSTEM_PROMPT = `You are a [role] specializing in [domain].

Your role is to:
1. [Primary responsibility]
2. [Secondary responsibility]
3. [Tertiary responsibility]

Guidelines:
- [Guideline 1]
- [Guideline 2]
- [Guideline 3]

Output format:
- [Section 1]: [Description]
- [Section 2]: [Description]
`;
```

## Content Processing

### Placeholder Detection

Always check for and remove placeholders before processing:

```typescript
import { hasPlaceholders, removePlaceholders } from '@/lib/utils/placeholder-detector';

const cleaned = removePlaceholders(content);
if (hasPlaceholders(cleaned)) {
  throw new Error('Content still contains placeholders');
}
```

### File Validation

Special handling for documentation files:

- **README.md**: Minimum 50 characters, no placeholders
- **LICENSE**: Minimum 100 characters, must be complete
- **All files**: Check for common placeholder patterns

## TypeScript Guidelines

### Strict Mode

Always use TypeScript strict mode:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

### Type Definitions

1. **Define interfaces** for all API inputs/outputs
2. **Use type exports** from `types/index.ts`
3. **Avoid `any` type** unless absolutely necessary
4. **Use const assertions** for literal types
5. **Document complex types** with JSDoc comments

### Example

```typescript
/**
 * Request type for Japanese concept explanation
 */
export interface JapaneseConceptRequest {
  query: string;
  conversationHistory?: ConversationMessage[];
}

/**
 * Response type for Japanese concept explanation
 */
export interface JapaneseConceptResponse {
  success: boolean;
  concept?: JapaneseConcept;
  error?: string;
  timestamp: string;
}
```

## Error Handling

### Principles

1. **Always catch errors** in server actions and API routes
2. **Log errors server-side** with context
3. **Return user-friendly messages** to clients
4. **Never expose sensitive information** in errors
5. **Use structured error responses**

### Example

```typescript
try {
  // Operation
} catch (error) {
  console.error('Context for debugging:', {
    operation: 'actionName',
    input,
    error,
    timestamp: new Date().toISOString(),
  });
  
  return {
    success: false,
    error: 'A user-friendly error message',
    timestamp: new Date().toISOString(),
  };
}
```

## Security Guidelines

### API Keys

- **Never commit** API keys to version control
- **Use environment variables** exclusively
- **Validate presence** of required keys at startup
- **Rotate keys** regularly

### Input Validation

- **Validate all inputs** before processing
- **Sanitize user content** to prevent injection
- **Set length limits** on text inputs
- **Check for malicious patterns**

### Rate Limiting

Implement rate limiting for production:

```typescript
// Recommended: Use @upstash/ratelimit
import { Ratelimit } from '@upstash/ratelimit';

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 requests per minute
});
```

## Testing Guidelines

### Unit Tests

Test utility functions in isolation:

```typescript
// placeholder-detector.test.ts
import { hasPlaceholders, removePlaceholders } from './placeholder-detector';

describe('Placeholder Detector', () => {
  it('should detect placeholder patterns', () => {
    expect(hasPlaceholders('[TODO]')).toBe(true);
    expect(hasPlaceholders('Clean text')).toBe(false);
  });
});
```

### Integration Tests

Test API endpoints with mocked OpenAI:

```typescript
// japanese-concept.test.ts
import { POST } from '@/app/api/japanese-concept/route';

jest.mock('@/lib/openai', () => ({
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Mock response' } }],
      }),
    },
  },
}));

describe('Japanese Concept API', () => {
  it('should return concept explanation', async () => {
    const request = new Request('http://localhost/api/japanese-concept', {
      method: 'POST',
      body: JSON.stringify({ query: 'What is ikigai?' }),
    });
    
    const response = await POST(request);
    const data = await response.json();
    
    expect(data.success).toBe(true);
    expect(data.concept).toBeDefined();
  });
});
```

## Performance Guidelines

### Optimization Strategies

1. **Cache common queries** (implement Redis or in-memory cache)
2. **Limit conversation history** to last 10 messages
3. **Use streaming** for long responses (future enhancement)
4. **Implement pagination** for list endpoints (if added)
5. **Monitor token usage** to control costs

### Response Time Targets

- Cached responses: <100ms
- OpenAI API calls: 2-10 seconds (typical)
- File validation: <50ms
- Placeholder detection: <10ms

## Documentation Requirements

### Code Comments

```typescript
/**
 * Brief description of function
 * 
 * Longer description if needed, explaining:
 * - What the function does
 * - Why it exists
 * - Any important considerations
 * 
 * @param paramName - Description of parameter
 * @returns Description of return value
 * 
 * @example
 * const result = functionName(param);
 */
export async function functionName(paramName: string): Promise<ResultType> {
  // Implementation
}
```

### API Documentation

- Update `docs/API.md` for new endpoints
- Include request/response examples
- Document error cases
- Provide cURL examples

## Git Workflow

### Commit Messages

Follow conventional commits:

```
type(scope): brief description

Longer description if needed

- Detail 1
- Detail 2
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

### Branch Naming

```
feature/japanese-concept-caching
fix/placeholder-detection-bug
docs/api-documentation-update
```

### Before Committing

1. Run linter: `pnpm lint`
2. Fix linter errors
3. Test changes locally
4. Update documentation if needed
5. Check for debug logs or console.log statements

## Japanese Cultural Guidelines

### Accuracy

1. **Research thoroughly** before implementing concepts
2. **Consult authentic sources** (Japanese researchers, translators)
3. **Avoid oversimplification** or "washing" of concepts
4. **Respect cultural context** and nuances
5. **Use proper terminology** with pronunciation guides

### Representation

- Use Japanese characters (kanji/hiragana) when appropriate
- Provide romanization for pronunciation
- Include historical and cultural context
- Explain differences from Western concepts
- Acknowledge complexity and depth

### Examples of Good Practice

```typescript
// ✅ Good: Accurate, respectful, contextual
"Ikigai (生き甲斐) [ee-kee-guy] is a nuanced Japanese concept that 
represents one's reason for being. While Western culture often frames 
purpose in terms of achievement, ikigai emphasizes harmony between 
personal fulfillment and contribution to society..."

// ❌ Bad: Oversimplified, potentially inaccurate
"Ikigai means finding your passion. It's like the Japanese version of 
following your dreams..."
```

## Code Review Checklist

Before submitting for review:

- [ ] TypeScript strict mode passes
- [ ] Linter passes (`pnpm lint`)
- [ ] All inputs validated
- [ ] Placeholders checked and removed
- [ ] Errors handled gracefully
- [ ] API keys not exposed
- [ ] Console.log statements removed
- [ ] Documentation updated
- [ ] Types properly defined
- [ ] Server actions use `'use server'`
- [ ] Responses follow standard format
- [ ] Cultural accuracy verified (for Japanese content)

## Deployment Checklist

Before deploying:

- [ ] Environment variables configured
- [ ] Build succeeds (`pnpm build`)
- [ ] All tests pass (when implemented)
- [ ] API endpoints tested
- [ ] Error handling verified
- [ ] Performance acceptable
- [ ] Documentation up to date
- [ ] Security review completed
- [ ] Rate limiting configured (if needed)

## Common Pitfalls

### 1. Client-Side API Key Exposure

❌ **Don't**:
```typescript
// In client component
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
```

✅ **Do**:
```typescript
// In server action or API route
'use server';
import openai from '@/lib/openai';
```

### 2. Unvalidated Input

❌ **Don't**:
```typescript
export async function action(input: string) {
  const result = await openai.chat.completions.create({
    messages: [{ role: 'user', content: input }],
  });
}
```

✅ **Do**:
```typescript
export async function action(input: string) {
  const cleaned = removePlaceholders(input);
  const validation = validateContentForProcessing(cleaned);
  if (!validation.valid) {
    throw new Error(validation.errors.join(', '));
  }
  // ... proceed with processing
}
```

### 3. Missing Error Handling

❌ **Don't**:
```typescript
export async function action() {
  const result = await openai.chat.completions.create({...});
  return result;
}
```

✅ **Do**:
```typescript
export async function action() {
  try {
    const result = await openai.chat.completions.create({...});
    return { success: true, data: result };
  } catch (error) {
    console.error('Error:', error);
    return { success: false, error: 'Failed to process request' };
  }
}
```

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [OpenAI API Reference](https://platform.openai.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Japanese Culture Resources](#) (add as needed)

## Questions or Clarifications

For questions about these rules, open an issue or discussion in the repository.

