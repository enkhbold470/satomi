import { NextRequest, NextResponse } from 'next/server';
import { explainJapaneseConcept } from '@/lib/actions/japanese-concept-action';

/**
 * Japanese Concept API Route
 * 
 * POST /api/japanese-concept
 * 
 * Request body:
 * {
 *   "query": "What is ikigai?",
 *   "conversationHistory": [
 *     { "role": "user", "content": "previous message" },
 *     { "role": "assistant", "content": "previous response" }
 *   ]
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "concept": {
 *     "name": "Ikigai",
 *     "explanation": "...",
 *     "origin": "...",
 *     "application": "...",
 *     "fullResponse": "..."
 *   },
 *   "timestamp": "2025-11-01T..."
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { query, conversationHistory } = body;

    if (!query || typeof query !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Query is required and must be a string',
        },
        { status: 400 }
      );
    }

    const response = await explainJapaneseConcept({
      query,
      conversationHistory,
    });

    return NextResponse.json(response, {
      status: response.success ? 200 : 500,
    });
  } catch (error) {
    console.error('Error in Japanese concept API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

