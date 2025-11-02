# Satomi API Examples

This directory contains example code for using the Satomi API in different programming languages.

## Available Examples

### 1. Node.js Example (`node-example.js`)

Demonstrates using the Satomi API from a Node.js application.

**Features:**
- Simple concept explanation
- Conversational interface with history
- Content processing
- Reusable functions and classes

**Usage:**
```bash
# Make sure Satomi is running on localhost:3000
pnpm dev

# In another terminal, run the example
node examples/node-example.js
```

**Import and use in your code:**
```javascript
const { explainConcept, ConceptConversation } = require('./examples/node-example.js');

// Simple usage
const concept = await explainConcept("What is kaizen?");
console.log(concept.fullResponse);

// Conversational usage
const chat = new ConceptConversation();
const response = await chat.ask("What is ikigai?");
```

### 2. Python Example (`python-example.py`)

Demonstrates using the Satomi API from a Python application.

**Features:**
- Complete client class
- Conversation management
- File validation
- Type hints for better IDE support

**Requirements:**
```bash
pip install requests
```

**Usage:**
```bash
# Make sure Satomi is running on localhost:3000
pnpm dev

# In another terminal, run the example
python examples/python-example.py
```

**Import and use in your code:**
```python
from examples.python_example import SatomiClient, ConceptConversation

# Simple usage
client = SatomiClient()
concept = client.explain_concept("What is mono no aware?")
print(concept['fullResponse'])

# Conversational usage
conversation = ConceptConversation()
response = conversation.ask("What is ikigai?")
```

## Example Output

### Simple Concept Explanation

```
Concept: Ikigai (生き甲斐)

Explanation: Ikigai is a Japanese concept meaning "reason for being"...
Origin: The term originates from the island of Okinawa...
Application: To discover your ikigai, reflect on: What you love...
```

### Conversational Interface

```
Q: What is wabi-sabi?
A: Wabi-Sabi (侘寂)

Q: How can I practice it in my daily life?
A: To incorporate wabi-sabi into your daily life...

Conversation history: 4 messages
```

### Content Processing

```
Original content had placeholders.
Improved content:
This is my project description. It has been enhanced and polished for clarity...
```

## API Endpoints Used

All examples demonstrate these endpoints:

1. **POST /api/japanese-concept**
   - Explain Japanese cultural concepts
   - Maintain conversation history

2. **POST /api/process-content**
   - Improve, summarize, or analyze content
   - Remove placeholder text

3. **POST /api/validate-file**
   - Validate README/LICENSE files
   - Check for placeholders

## Common Use Cases

### 1. Learning Platform

```javascript
// Build a learning session
class LearningSession {
  constructor() {
    this.conversation = new ConceptConversation();
    this.concepts = [];
  }

  async learn(concept) {
    const result = await this.conversation.ask(`Explain ${concept}`);
    this.concepts.push(result.name);
    return result;
  }

  getLearnedConcepts() {
    return this.concepts;
  }
}
```

### 2. Content Generator

```python
def generate_blog_post(concept_name: str) -> str:
    """Generate a blog post about a Japanese concept"""
    client = SatomiClient()
    
    # Get detailed explanation
    concept = client.explain_concept(f"Explain {concept_name} in detail")
    
    # Format as blog post
    blog = client.process_content(
        concept['fullResponse'],
        process_type='custom',
        custom_prompt='Format this as an engaging blog post'
    )
    
    return blog
```

### 3. Documentation Validator

```javascript
async function validateProjectDocs() {
  const files = ['README.md', 'LICENSE', 'CONTRIBUTING.md'];
  const results = [];

  for (const filename of files) {
    const content = await readFile(filename);
    
    const validation = await fetch('/api/validate-file', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ filename, content }),
    }).then(r => r.json());

    results.push({ filename, ...validation });
  }

  return results;
}
```

### 4. Chatbot Integration

```python
class JapaneseCultureBot:
    def __init__(self):
        self.conversation = ConceptConversation()
    
    def handle_message(self, user_message: str) -> str:
        """Process user message and return bot response"""
        concept = self.conversation.ask(user_message)
        return concept['fullResponse']
    
    def reset(self):
        """Reset conversation context"""
        self.conversation.clear_history()
```

## Testing Examples

Before running examples, ensure:

1. Satomi is running:
```bash
pnpm dev
```

2. OpenAI API key is configured:
```bash
# .env.local
OPENAI_API_KEY=sk-proj-your-key-here
```

3. Test the API is working:
```bash
curl -X POST http://localhost:3000/api/japanese-concept \
  -H "Content-Type: application/json" \
  -d '{"query": "What is ikigai?"}'
```

## Error Handling

All examples include basic error handling. In production, consider:

1. **Retry logic** for transient failures
2. **Rate limiting** to avoid excessive costs
3. **Caching** for frequently asked concepts
4. **Input validation** before sending to API

Example with retry:
```javascript
async function explainConceptWithRetry(query, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await explainConcept(query);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}
```

## Performance Tips

1. **Cache responses** for common queries
2. **Limit conversation history** to last 10 messages
3. **Use batch processing** for multiple requests
4. **Implement timeouts** for API calls

Example caching:
```javascript
const cache = new Map();

async function getCachedConcept(query) {
  if (cache.has(query)) {
    return cache.get(query);
  }
  
  const concept = await explainConcept(query);
  cache.set(query, concept);
  
  // Clear after 1 hour
  setTimeout(() => cache.delete(query), 60 * 60 * 1000);
  
  return concept;
}
```

## Additional Resources

- [API Documentation](../docs/API.md)
- [Usage Guide](../docs/USAGE.md)
- [Architecture Overview](../docs/ARCHITECTURE.md)

## Contributing Examples

To add a new example:

1. Create a new file: `examples/language-example.ext`
2. Follow the pattern of existing examples
3. Include comprehensive comments
4. Add usage instructions to this README
5. Test thoroughly before submitting

## Support

If you have questions about these examples:
- Review the [API Documentation](../docs/API.md)
- Check the [Usage Guide](../docs/USAGE.md)
- Open an issue with example code and error messages

