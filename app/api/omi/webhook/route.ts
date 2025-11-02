import { NextRequest, NextResponse } from 'next/server';
import { explainJapaneseConcept } from '@/lib/actions/japanese-concept-action';

/**
 * OMI Webhook Integration
 * 
 * POST /api/omi/webhook
 * 
 * Receives real-time transcripts from OMI wearable device and returns
 * beautifully explained Japanese concepts when detected.
 * 
 * Request body from OMI:
 * {
 *   "transcript": "What is ikigai?",
 *   "segments": [...],
 *   "session_id": "...",
 *   "user_id": "..."
 * }
 * 
 * Response:
 * {
 *   "message": "Beautifully formatted Japanese concept explanation"
 * }
 */

// Keywords that trigger Japanese concept explanations
const JAPANESE_CONCEPT_TRIGGERS = [
  'what is',
  'explain',
  'tell me about',
  'meaning of',
  'define',
  'japanese concept',
  'japanese philosophy',
  'ikigai',
  'wabi-sabi',
  'kaizen',
  'kintsugi',
  'mono no aware',
  'omotenashi',
  'gaman',
  'shouganai',
  'ichi-go ichi-e',
];

/**
 * Detects if transcript is asking about a Japanese concept
 */
function isJapaneseConceptQuery(transcript: string): boolean {
  const lowerTranscript = transcript.toLowerCase();
  return JAPANESE_CONCEPT_TRIGGERS.some(trigger => 
    lowerTranscript.includes(trigger)
  );
}

/**
 * Formats the concept explanation for OMI display
 */
function formatForOMI(conceptData: {
  name: string;
  explanation: string;
  origin: string;
  application: string;
}): string {
  const { name, explanation, origin, application } = conceptData;
  
  return `
🇯🇵 ${name}

✨ Meaning:
${explanation}

📜 Origin:
${origin}

💡 How to Apply:
${application}

---
A beautifully explained Japanese concept from Satomi 🎌
  `.trim();
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const transcript = body.transcript || body.text || '';
    const sessionId = body.session_id || body.sessionId;
    const userId = body.user_id || body.userId;

    console.log('OMI webhook received:', {
      transcript,
      sessionId,
      userId,
      timestamp: new Date().toISOString(),
    });

    // Check if this is a Japanese concept query
    if (!transcript || transcript.trim().length === 0) {
      return NextResponse.json({
        message: 'Ready to explain Japanese concepts! Ask me about ikigai, wabi-sabi, kaizen, or any Japanese philosophy.',
      });
    }

    // Only process Japanese concept queries
    if (!isJapaneseConceptQuery(transcript)) {
      // Return a helpful prompt
      return NextResponse.json({
        message: '🎌 Ask me about Japanese concepts like:\n• Ikigai (purpose)\n• Wabi-Sabi (beauty in imperfection)\n• Kaizen (continuous improvement)\n• Kintsugi (art of repair)\n...and many more!',
      });
    }

    // Process the query through our Japanese concept system
    const result = await explainJapaneseConcept({
      query: transcript,
    });

    if (!result.success || !result.concept) {
      return NextResponse.json({
        message: `I couldn't process that query. ${result.error || 'Please try asking about a specific Japanese concept.'}`,
      });
    }

    // Format the response for OMI
    const formattedMessage = formatForOMI(result.concept);

    return NextResponse.json({
      message: formattedMessage,
      concept_name: result.concept.name,
      timestamp: result.timestamp,
    });

  } catch (error) {
    console.error('Error in OMI webhook:', error);
    
    return NextResponse.json({
      message: 'An error occurred while processing your request. Please try again.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Optional: GET endpoint for webhook verification
export async function GET() {
  return NextResponse.json({
    status: 'active',
    service: 'Satomi Japanese Concept Learning',
    description: 'OMI integration for beautifully explained Japanese concepts',
    version: '1.0.0',
  });
}

