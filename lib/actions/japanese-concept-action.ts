'use server';

import openai from '@/lib/openai';
import { removePlaceholders, validateContentForProcessing } from '@/lib/utils/placeholder-detector';

/**
 * Japanese Concept Explanation Server Action
 * 
 * Processes user queries and returns beautifully explained Japanese concepts
 * using OpenAI's API. Each response focuses on a single concept with:
 * - What it means
 * - Where it comes from
 * - How to apply it in daily life
 */

export interface JapaneseConceptRequest {
  query: string;
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>;
}

export interface JapaneseConceptResponse {
  success: boolean;
  concept?: {
    name: string;
    explanation: string;
    origin: string;
    application: string;
    fullResponse: string;
  };
  error?: string;
  timestamp: string;
}

const SYSTEM_PROMPT = `You are a Japanese cultural expert specializing in explaining traditional Japanese concepts, philosophies, and principles to Western audiences. Your role is to:

1. Identify the most relevant Japanese concept based on the user's question or interest
2. Provide a clear, engaging 3-minute read (approximately 500-700 words)
3. Structure your response as follows:
   - **Concept Name** (in Japanese with pronunciation)
   - **Meaning**: Clear definition in simple terms
   - **Origin**: Historical and cultural context
   - **Application**: Practical ways to apply this concept in daily life
   - **Quotable Wisdom**: Include memorable phrases that readers will want to share

Guidelines:
- Be accurate and respectful of Japanese culture
- Avoid oversimplification or "washing" of concepts
- Make the content engaging and accessible
- Include relevant examples and stories
- Focus on ONE concept per response
- Write in a warm, conversational tone
- Make the wisdom actionable and relevant to modern life

Examples of Japanese concepts you might explain: Ikigai, Wabi-Sabi, Kaizen, Kintsugi, Mono no Aware, Omotenashi, Gaman, Shouganai, Ma, Ichi-go Ichi-e, etc.`;

export async function explainJapaneseConcept(
  request: JapaneseConceptRequest
): Promise<JapaneseConceptResponse> {
  try {
    // Validate and clean input
    const cleanedQuery = removePlaceholders(request.query);
    const validation = validateContentForProcessing(cleanedQuery);

    if (!validation.valid) {
      return {
        success: false,
        error: `Invalid input: ${validation.errors.join(', ')}`,
        timestamp: new Date().toISOString(),
      };
    }

    // Build conversation history
    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ];

    // Add conversation history if provided
    if (request.conversationHistory && request.conversationHistory.length > 0) {
      messages.push(...request.conversationHistory);
    }

    // Add current query
    messages.push({ role: 'user', content: cleanedQuery });

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: messages,
      temperature: 0.7,
      max_tokens: 1500,
    });

    const fullResponse = completion.choices[0]?.message?.content || '';

    if (!fullResponse) {
      return {
        success: false,
        error: 'No response generated from OpenAI',
        timestamp: new Date().toISOString(),
      };
    }

    // Parse the response to extract structured information
    const parsed = parseConceptResponse(fullResponse);

    return {
      success: true,
      concept: {
        ...parsed,
        fullResponse,
      },
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in explainJapaneseConcept:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Parses the OpenAI response to extract structured concept information
 */
function parseConceptResponse(response: string): {
  name: string;
  explanation: string;
  origin: string;
  application: string;
} {
  const lines = response.split('\n');
  let name = '';
  let explanation = '';
  let origin = '';
  let application = '';

  let currentSection = '';

  for (const line of lines) {
    const trimmed = line.trim();

    // Detect concept name (usually first header or bold text)
    if (trimmed.startsWith('**') && trimmed.endsWith('**') && !name) {
      name = trimmed.replace(/\*\*/g, '').trim();
      continue;
    }

    // Detect sections
    if (trimmed.toLowerCase().includes('meaning')) {
      currentSection = 'explanation';
      continue;
    }
    if (trimmed.toLowerCase().includes('origin')) {
      currentSection = 'origin';
      continue;
    }
    if (trimmed.toLowerCase().includes('application')) {
      currentSection = 'application';
      continue;
    }

    // Add content to appropriate section
    if (trimmed.length > 0) {
      switch (currentSection) {
        case 'explanation':
          explanation += trimmed + ' ';
          break;
        case 'origin':
          origin += trimmed + ' ';
          break;
        case 'application':
          application += trimmed + ' ';
          break;
        default:
          if (!name && trimmed.length > 3 && trimmed.length < 50) {
            name = trimmed;
          }
      }
    }
  }

  return {
    name: name || 'Japanese Concept',
    explanation: explanation.trim() || response.substring(0, 200),
    origin: origin.trim() || 'Traditional Japanese wisdom',
    application: application.trim() || 'Apply mindfully in daily life',
  };
}

