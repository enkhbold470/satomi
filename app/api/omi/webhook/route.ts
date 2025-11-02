import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OMIWebhookPayload } from '@/types/omi';

/**
 * OMI Webhook Integration
 * 
 * POST /api/omi/webhook
 * 
 * Receives real-time transcripts from OMI wearable device and returns
 * Zen Buddhist-style explanations of any topic using GPT-4o-mini.
 * 
 * Request body from OMI:
 * {
 *   "segments": [...],
 *   "session_id": "...",
 * }
 * 
 * Response:
 * {
 *   "message": "Zen Buddhist-style explanation"
 * }
 */

console.log("Initializing OpenAI client for Satomi OMI Webhook...");
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Wake word that triggers the assistant
const WAKE_WORDS = ['hey satomi', 'hey, satomi', 'satomi', 'tommy', 'tummy', 'hey satomi'];
console.log("Wake word set:", WAKE_WORDS);

/**
 * Detects if transcript contains the wake word
 */
function isWakeWordDetected(transcript: string): boolean {
  console.log("Checking for wake word in transcript:", transcript);
  const detected = WAKE_WORDS.some(word => transcript.toLowerCase().includes(word));
  console.log(`Wake word detected: ${detected}`);
  return detected;
}

/**
 * Extracts the user's query after the wake word
 */
function extractQuery(transcript: string): string {
  console.log("Extracting query from transcript:", transcript);
  const lowerTranscript = transcript.toLowerCase();
  const wakeWordIndex = WAKE_WORDS.findIndex(word => lowerTranscript.includes(word));
  
  if (wakeWordIndex === -1) {
    console.log("Wake word not found. Returning original transcript as query.");
    return transcript;
  }
  
  // Extract everything after "hey satomi"
  const extracted = transcript.substring(wakeWordIndex + WAKE_WORDS[wakeWordIndex]?.length || 0).trim();
  console.log("Extracted query:", extracted);
  return extracted;
}

/**
 * Calls GPT-4o-mini to generate Zen Buddhist-style explanation
 */
async function getZenExplanation(query: string): Promise<string> {
  console.log("Calling GPT-4o-mini for Zen explanation of:", query);
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are Satomi, a wise Zen Buddhist teacher who explains complex concepts with profound simplicity, mindfulness, and insight. Your explanations blend ancient wisdom with modern understanding. Use metaphors from nature, tea ceremonies, and daily mindful practice. Keep responses concise yet deeply meaningful. Format your responses with gentle structure and thoughtful emojis.`
        },
        {
          role: 'user',
          content: `Please explain: ${query}`
        }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const explanation = completion.choices[0].message.content || 'The answer resides in the silence between questions. 🍃';
    console.log("Received Zen explanation from GPT-4o-mini:", explanation);
    return explanation;
  } catch (error) {
    console.error('Error calling GPT-4o-mini:', error);
    throw new Error('Unable to generate explanation at this moment.');
  }
}

/**
 * Formats the Zen explanation for OMI display
 */
function formatZenResponse(query: string, explanation: string): string {
  console.log("Formatting Zen response...");
  const formatted = `
🧘 Satomi's Wisdom

📿 Question:
${query}

🌸 Understanding:
${explanation}

---
Explained with mindful clarity by Satomi 🍵
  `.trim();
  console.log("Formatted Zen response:", formatted);
  return formatted;
}

export async function POST(request: NextRequest) {
  console.log("Received POST request to OMI webhook endpoint.");
  try {
    const body: OMIWebhookPayload = await request.json();
    console.log("Parsed OMI payload:", body);
    
    // Extract transcript from OMI segments array
    let transcript = '';
    
    if (body.segments && Array.isArray(body.segments) && body.segments.length > 0) {
      console.log("Extracting transcript from segments array...");
      transcript = body.segments
        .map((segment: { text: string }) => {
          console.log("Segment text:", segment.text);
          return segment.text;
        })
        .join(' ')
        .trim();
      console.log("Combined transcript from segments:", transcript);
    } else {
      transcript = body.segments && body.segments[0]?.text ? body.segments[0].text : '';
      console.log("Fallback transcript extraction. Transcript:", transcript);
    }
    
    const sessionId = body.session_id;
    const userId = body.segments && body.segments[0]?.person_id;

    console.log('OMI webhook received:', {
      transcript,
      sessionId,
      userId,
      segmentCount: body.segments?.length || 0,
      timestamp: new Date().toISOString(),
    });

    // Check if transcript is empty
    if (!transcript || transcript.trim().length === 0) {
      console.log("Transcript is empty. Returning help message.");
      return NextResponse.json({
        message: '🧘 Say "Hey Satomi" followed by any question about math, science, philosophy, or life. I will explain it with Zen wisdom.',
      });
    }

    // Check for wake word
    if (!isWakeWordDetected(transcript)) {
      console.log('Wake word not detected in transcript.');
      return NextResponse.json({
        message: '🌸 Say "Hey Satomi" to ask me about:\n• Mathematics & Science\n• Physics (Newton\'s Laws, Quantum Theory)\n• Philosophy & Life\n• Technology & Nature\n...or anything else you wish to understand deeply.',
      });
    }

    // Extract the user's query
    const userQuery = extractQuery(transcript);

    if (!userQuery || userQuery.length === 0) {
      console.log('Wake word was detected but no question was found after wake word.');
      return NextResponse.json({
        message: '🍃 You called upon me, but I did not hear your question. Please ask again after "Hey Satomi".',
      });
    }

    // Get Zen-style explanation from GPT-4o-mini
    const zenExplanation = await getZenExplanation(userQuery);

    // Format the response
    const formattedMessage = formatZenResponse(userQuery, zenExplanation);

    console.log('Responding with final Zen message:', {
      message: formattedMessage,
      query: userQuery
    });

    return NextResponse.json({
      message: formattedMessage,
      query: userQuery,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error in OMI webhook:', error);
    return NextResponse.json({
      message: '⛩️ The path to understanding is temporarily clouded. Please try again, and I shall guide you.',
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

// Optional: GET endpoint for webhook verification
export async function GET() {
  console.log("Received GET request to OMI webhook endpoint. Sending status and info.");
  return NextResponse.json({
    status: 'active',
    service: 'Satomi - Zen Buddhist AI Teacher',
    description: 'OMI integration for mindful explanations of any topic',
    version: '2.0.0',
    wake_word: WAKE_WORDS.join(', '),
  });
}
