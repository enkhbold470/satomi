import { NextRequest, NextResponse } from 'next/server';
import { explainJapaneseConcept } from '@/lib/actions/japanese-concept-action';

/**
 * OMI Memory Creation Integration
 * 
 * POST /api/omi/memory
 * 
 * Triggered when OMI creates a memory from a conversation.
 * Analyzes the conversation for Japanese concepts and provides
 * context and explanations.
 * 
 * Request body:
 * {
 *   "memory_id": "...",
 *   "transcript": "full conversation transcript",
 *   "summary": "conversation summary",
 *   "created_at": "timestamp"
 * }
 */

// Japanese concept keywords to detect in conversations
const JAPANESE_CONCEPTS = [
  'ikigai', 'wabi-sabi', 'wabisabi', 'kaizen', 'kintsugi',
  'mono no aware', 'omotenashi', 'gaman', 'shouganai',
  'ma', 'ichi-go ichi-e', 'komorebi', 'yugen', 'shibui',
  'oubaitori', 'natsukashii', 'tsundoku', 'shinrin-yoku',
];

/**
 * Detects Japanese concepts mentioned in transcript
 */
function detectJapaneseConcepts(transcript: string): string[] {
  const lowerTranscript = transcript.toLowerCase();
  return JAPANESE_CONCEPTS.filter(concept => 
    lowerTranscript.includes(concept)
  );
}

/**
 * Creates a memory annotation with Japanese concept explanations
 */
async function createConceptAnnotation(concepts: string[]): Promise<string> {
  if (concepts.length === 0) {
    return '';
  }

  const explanations: string[] = [];

  for (const concept of concepts.slice(0, 3)) { // Limit to 3 concepts
    try {
      const result = await explainJapaneseConcept({
        query: `Briefly explain ${concept}`,
      });

      if (result.success && result.concept) {
        explanations.push(`
📖 ${result.concept.name}
${result.concept.explanation.substring(0, 200)}...
        `.trim());
      }
    } catch (error) {
      console.error(`Error explaining ${concept}:`, error);
    }
  }

  if (explanations.length === 0) {
    return '';
  }

  return `
🎌 Japanese Concepts Detected:

${explanations.join('\n\n')}

---
Learn more at Satomi
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { memory_id, created_at } = body;
    
    // Extract transcript from segments array or fallback to direct field
    let transcript = '';
    
    if (body.segments && Array.isArray(body.segments) && body.segments.length > 0) {
      // Real OMI format: combine all segment texts
      transcript = body.segments
        .map((segment: { text: string }) => segment.text)
        .join(' ')
        .trim();
    } else {
      // Fallback for testing
      transcript = body.transcript || '';
    }

    console.log('OMI memory webhook received:', {
      memory_id,
      created_at,
      segmentCount: body.segments?.length || 0,
      transcriptLength: transcript.length,
      timestamp: new Date().toISOString(),
    });

    if (!transcript) {
      return NextResponse.json({
        status: 'received',
        annotation: null,
      });
    }

    // Detect Japanese concepts in the conversation
    const detectedConcepts = detectJapaneseConcepts(transcript);

    if (detectedConcepts.length === 0) {
      return NextResponse.json({
        status: 'received',
        annotation: null,
        message: 'No Japanese concepts detected in this conversation.',
      });
    }

    // Create annotation with concept explanations
    const annotation = await createConceptAnnotation(detectedConcepts);

    return NextResponse.json({
      status: 'received',
      memory_id,
      detected_concepts: detectedConcepts,
      annotation,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in OMI memory webhook:', error);
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'Satomi Memory Integration',
    description: 'Annotates OMI memories with Japanese concept explanations',
    version: '1.0.0',
  });
}

