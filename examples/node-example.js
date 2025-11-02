/**
 * Node.js Example - Using Satomi API
 * 
 * This example demonstrates how to use the Satomi API
 * for Japanese concept explanations from a Node.js application.
 */

const BASE_URL = 'http://localhost:3000';

/**
 * Get explanation of a Japanese concept
 */
async function explainConcept(query) {
  const response = await fetch(`${BASE_URL}/api/japanese-concept`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query }),
  });

  const data = await response.json();

  if (data.success) {
    return data.concept;
  } else {
    throw new Error(data.error || 'Request failed');
  }
}

/**
 * Process content with AI
 */
async function processContent(content, processType = 'improve') {
  const response = await fetch(`${BASE_URL}/api/process-content`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content, processType }),
  });

  const data = await response.json();

  if (data.success) {
    return data.processedContent;
  } else {
    throw new Error(data.error || 'Request failed');
  }
}

/**
 * Conversation class for maintaining context
 */
class ConceptConversation {
  constructor() {
    this.history = [];
  }

  async ask(query) {
    const response = await fetch(`${BASE_URL}/api/japanese-concept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query,
        conversationHistory: this.history,
      }),
    });

    const data = await response.json();

    if (data.success) {
      // Add to history
      this.history.push({ role: 'user', content: query });
      this.history.push({
        role: 'assistant',
        content: data.concept.fullResponse,
      });

      return data.concept;
    } else {
      throw new Error(data.error || 'Request failed');
    }
  }

  clearHistory() {
    this.history = [];
  }

  getHistory() {
    return this.history;
  }
}

// Example usage
async function main() {
  try {
    // Example 1: Simple concept explanation
    console.log('Example 1: Simple Concept Explanation\n');
    const concept = await explainConcept('What is ikigai?');
    console.log(`Concept: ${concept.name}`);
    console.log(`\n${concept.fullResponse}\n`);

    // Example 2: Conversational interface
    console.log('\nExample 2: Conversational Interface\n');
    const conversation = new ConceptConversation();

    const response1 = await conversation.ask('What is wabi-sabi?');
    console.log(`Q: What is wabi-sabi?`);
    console.log(`A: ${response1.name}\n`);

    const response2 = await conversation.ask(
      'How can I practice it in my daily life?'
    );
    console.log(`Q: How can I practice it in my daily life?`);
    console.log(`A: ${response2.application}\n`);

    // Example 3: Content processing
    console.log('\nExample 3: Content Processing\n');
    const rawContent = `
      This is my project description with [placeholder] text.
      TODO: Add more details here.
      It needs improvement and polish.
    `;

    const improved = await processContent(rawContent, 'improve');
    console.log('Original content had placeholders.');
    console.log(`Improved content:\n${improved}\n`);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

// Run examples if this file is executed directly
if (require.main === module) {
  main();
}

// Export for use in other modules
module.exports = {
  explainConcept,
  processContent,
  ConceptConversation,
};

