# OpenAI Integration Rules

Specific guidelines for integrating and using OpenAI API in Satomi.

## Configuration

### Environment Setup

```bash
# .env.local
OPENAI_API_KEY=sk-proj-your-api-key-here
```

### Client Initialization

Always use the centralized OpenAI client from `lib/openai.ts`:

```typescript
// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  maxRetries: 3,
  timeout: 30000, // 30 seconds
});

export default openai;
```

## Model Selection

### Recommended Models

| Model | Use Case | Cost | Speed |
|-------|----------|------|-------|
| `gpt-4o` | Default for all operations | Medium | Fast |
| `gpt-4` | High-accuracy requirements | High | Medium |
| `gpt-3.5-turbo` | Simple queries, cost optimization | Low | Very Fast |

### Selection Criteria

```typescript
function selectModel(complexity: 'simple' | 'standard' | 'complex'): string {
  switch (complexity) {
    case 'simple':
      return 'gpt-3.5-turbo';
    case 'complex':
      return 'gpt-4';
    case 'standard':
    default:
      return 'gpt-4o';
  }
}
```

## Prompt Engineering

### System Prompts

Always include a comprehensive system prompt:

```typescript
const SYSTEM_PROMPT = `You are a [specific role].

Your responsibilities:
1. [Primary task]
2. [Secondary task]

Guidelines:
- [Guideline 1]
- [Guideline 2]

Output format:
- [Expected structure]
`;
```

### User Prompts

Be specific and contextual:

```typescript
// ❌ Vague
const userPrompt = "Tell me about ikigai";

// ✅ Specific
const userPrompt = `Explain the Japanese concept of ikigai in detail, including:
1. Its precise meaning and cultural significance
2. Historical origins and development
3. Practical applications for Western audiences
4. Common misconceptions to avoid

Format the response as a 3-minute read with quotable wisdom.`;
```

## Message Structure

### Basic Format

```typescript
const messages = [
  {
    role: 'system',
    content: SYSTEM_PROMPT,
  },
  {
    role: 'user',
    content: userQuery,
  },
];
```

### With Conversation History

```typescript
const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
  ...conversationHistory, // Array of { role, content }
  { role: 'user', content: currentQuery },
];
```

### History Management

Limit conversation history to prevent token overflow:

```typescript
function limitHistory(
  history: Message[],
  maxMessages: number = 10
): Message[] {
  // Keep most recent messages
  return history.slice(-maxMessages);
}
```

## API Calls

### Standard Pattern

```typescript
async function callOpenAI(messages: Message[]) {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages,
      temperature: 0.7,
      max_tokens: 1500,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('OpenAI API error:', error);
    throw new Error('Failed to generate response');
  }
}
```

### Parameters Explained

- **temperature** (0-2): Creativity level
  - `0.7`: Balanced (default for concepts)
  - `0.3`: More focused and deterministic
  - `1.0`: More creative and varied

- **max_tokens**: Maximum response length
  - Short responses: `500`
  - Standard responses: `1500`
  - Long-form content: `2000-4000`

- **top_p** (0-1): Nucleus sampling
  - Default: `1` (disabled)
  - For focused output: `0.9`

- **frequency_penalty** (-2 to 2): Reduces repetition
  - Default: `0`
  - Reduce repetition: `0.5-1.0`

- **presence_penalty** (-2 to 2): Encourages topic diversity
  - Default: `0`
  - Encourage new topics: `0.5-1.0`

## Error Handling

### Common Errors

```typescript
async function handleOpenAICall() {
  try {
    return await openai.chat.completions.create({...});
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      // Rate limit error
      if (error.status === 429) {
        console.error('Rate limit exceeded');
        throw new Error('Too many requests. Please try again later.');
      }
      
      // Invalid API key
      if (error.status === 401) {
        console.error('Invalid API key');
        throw new Error('Authentication failed');
      }
      
      // Model overloaded
      if (error.status === 503) {
        console.error('OpenAI service unavailable');
        throw new Error('Service temporarily unavailable');
      }
      
      // Generic API error
      console.error('OpenAI API error:', error);
      throw new Error('Failed to process request');
    }
    
    // Unknown error
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
}
```

### Retry Logic

Implement exponential backoff for transient errors:

```typescript
async function callWithRetry(
  fn: () => Promise<any>,
  maxRetries: number = 3
): Promise<any> {
  let lastError: Error;
  
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      // Don't retry auth errors
      if (error instanceof OpenAI.APIError && error.status === 401) {
        throw error;
      }
      
      // Exponential backoff: 1s, 2s, 4s
      const delay = Math.pow(2, i) * 1000;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
  
  throw lastError!;
}
```

## Token Management

### Monitoring Usage

```typescript
const completion = await openai.chat.completions.create({...});

// Log token usage
console.log('Token usage:', {
  prompt: completion.usage?.prompt_tokens,
  completion: completion.usage?.completion_tokens,
  total: completion.usage?.total_tokens,
});
```

### Cost Estimation

```typescript
function estimateCost(tokens: number, model: string): number {
  const pricing = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4': { input: 0.03, output: 0.06 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
  };
  
  const rates = pricing[model as keyof typeof pricing];
  // Simplified: assume 50/50 split
  return (tokens / 1000) * ((rates.input + rates.output) / 2);
}
```

### Token Limits

| Model | Max Tokens | Recommended Context |
|-------|-----------|---------------------|
| gpt-4o | 128,000 | 8,000 |
| gpt-4 | 8,192 | 4,000 |
| gpt-3.5-turbo | 16,385 | 4,000 |

## Streaming Responses

For future implementation:

```typescript
async function streamResponse(messages: Message[]) {
  const stream = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages,
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || '';
    process.stdout.write(content);
  }
}
```

## Content Moderation

Use OpenAI's moderation API for user-generated content:

```typescript
async function moderateContent(content: string): Promise<boolean> {
  const moderation = await openai.moderations.create({
    input: content,
  });
  
  const result = moderation.results[0];
  
  if (result.flagged) {
    console.warn('Content flagged:', result.categories);
    return false;
  }
  
  return true;
}
```

## Response Processing

### Parsing Structured Output

```typescript
function parseConceptResponse(response: string): JapaneseConcept {
  // Extract sections using regex or string parsing
  const nameMatch = response.match(/\*\*(.*?)\*\*/);
  const name = nameMatch ? nameMatch[1] : 'Unknown Concept';
  
  // Further parsing logic...
  
  return {
    name,
    explanation,
    origin,
    application,
    fullResponse: response,
  };
}
```

### Validation

```typescript
function validateResponse(response: string): boolean {
  // Check minimum length
  if (response.length < 100) {
    console.warn('Response too short');
    return false;
  }
  
  // Check for placeholder patterns
  if (hasPlaceholders(response)) {
    console.warn('Response contains placeholders');
    return false;
  }
  
  // Check for required sections (for concept responses)
  const requiredSections = ['meaning', 'origin', 'application'];
  const lowerResponse = response.toLowerCase();
  
  for (const section of requiredSections) {
    if (!lowerResponse.includes(section)) {
      console.warn(`Missing section: ${section}`);
      return false;
    }
  }
  
  return true;
}
```

## Caching Strategy

Implement caching to reduce API calls:

```typescript
class OpenAICache {
  private cache = new Map<string, CachedResponse>();
  private ttl = 60 * 60 * 1000; // 1 hour

  async get(
    key: string,
    fn: () => Promise<string>
  ): Promise<string> {
    const cached = this.cache.get(key);
    
    if (cached && Date.now() - cached.timestamp < this.ttl) {
      return cached.response;
    }
    
    const response = await fn();
    this.cache.set(key, {
      response,
      timestamp: Date.now(),
    });
    
    return response;
  }
  
  clear() {
    this.cache.clear();
  }
}

interface CachedResponse {
  response: string;
  timestamp: number;
}
```

## Testing with Mocks

Mock OpenAI for testing:

```typescript
// __mocks__/openai.ts
export default {
  chat: {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{
          message: {
            content: 'Mock response content',
          },
        }],
        usage: {
          prompt_tokens: 10,
          completion_tokens: 20,
          total_tokens: 30,
        },
      }),
    },
  },
};
```

## Best Practices Summary

1. ✅ **Always validate input** before sending to OpenAI
2. ✅ **Use centralized client** from `lib/openai.ts`
3. ✅ **Implement error handling** with user-friendly messages
4. ✅ **Monitor token usage** to control costs
5. ✅ **Limit conversation history** to recent messages
6. ✅ **Cache common queries** to reduce API calls
7. ✅ **Use appropriate models** based on complexity
8. ✅ **Set reasonable timeouts** (30 seconds recommended)
9. ✅ **Log errors** for debugging but don't expose to users
10. ✅ **Implement retry logic** for transient failures

## Common Mistakes to Avoid

1. ❌ Exposing API key to client
2. ❌ Not validating OpenAI responses
3. ❌ Ignoring token limits
4. ❌ Not handling rate limits
5. ❌ Sending sensitive data without review
6. ❌ Not monitoring costs
7. ❌ Using default parameters for everything
8. ❌ Not implementing caching
9. ❌ Ignoring error messages
10. ❌ Not testing with mocks

## Resources

- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Best Practices Guide](https://platform.openai.com/docs/guides/best-practices)
- [Rate Limits](https://platform.openai.com/docs/guides/rate-limits)
- [Safety Best Practices](https://platform.openai.com/docs/guides/safety-best-practices)

