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

// Initialize OpenAI client
console.log("[INIT] Initializing OpenAI client for Satomi OMI Webhook...");
let openai: OpenAI;

try {
  if (!process.env.OPENAI_API_KEY) {
    console.error("[INIT ERROR] OPENAI_API_KEY environment variable is not set!");
    throw new Error("OPENAI_API_KEY is required");
  }
  
  console.log("[INIT] OPENAI_API_KEY found, creating OpenAI instance...");
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
  console.log("[INIT SUCCESS] OpenAI client initialized successfully");
} catch (error) {
  console.error("[INIT CRITICAL ERROR] Failed to initialize OpenAI client:", error);
  throw error;
}

// Wake words that trigger the assistant
const WAKE_WORDS = ['hey satomi', 'hey, satomi', 'satomi', 'tommy', 'tummy'];
console.log("[CONFIG] Wake words configured:", WAKE_WORDS);

/**
 * Detects if transcript contains the wake word
 */
function isWakeWordDetected(transcript: string): boolean {
  console.log("[WAKE_WORD_CHECK] Checking for wake word in transcript:", transcript);
  
  try {
    if (!transcript) {
      console.warn("[WAKE_WORD_CHECK] Transcript is null or undefined");
      return false;
    }
    
    const lowerTranscript = transcript.toLowerCase();
    console.log("[WAKE_WORD_CHECK] Lowercased transcript:", lowerTranscript);
    
    const detected = WAKE_WORDS.some(word => {
      const includes = lowerTranscript.includes(word);
      console.log(`[WAKE_WORD_CHECK] Checking "${word}": ${includes}`);
      return includes;
    });
    
    console.log(`[WAKE_WORD_CHECK] Final result - Wake word detected: ${detected}`);
    return detected;
  } catch (error) {
    console.error("[WAKE_WORD_CHECK ERROR] Error during wake word detection:", error);
    return false;
  }
}

/**
 * Extracts the user's query after the wake word
 */
function extractQuery(transcript: string): string {
  console.log("[EXTRACT_QUERY] Starting query extraction from transcript:", transcript);
  
  try {
    if (!transcript) {
      console.warn("[EXTRACT_QUERY] Transcript is empty or undefined");
      return '';
    }
    
    const lowerTranscript = transcript.toLowerCase();
    console.log("[EXTRACT_QUERY] Lowercased transcript:", lowerTranscript);
    
    // Find which wake word was used
    let foundWakeWord = '';
    let wakeWordIndex = -1;
    
    for (const word of WAKE_WORDS) {
      const index = lowerTranscript.indexOf(word);
      console.log(`[EXTRACT_QUERY] Searching for "${word}" at index: ${index}`);
      
      if (index !== -1) {
        foundWakeWord = word;
        wakeWordIndex = index;
        console.log(`[EXTRACT_QUERY] Found wake word "${word}" at position ${index}`);
        break;
      }
    }
    
    if (wakeWordIndex === -1) {
      console.log("[EXTRACT_QUERY] No wake word found. Returning original transcript as query.");
      return transcript;
    }
    
    // Extract everything after the wake word
    const startPosition = wakeWordIndex + foundWakeWord.length;
    console.log(`[EXTRACT_QUERY] Extracting from position ${startPosition}`);
    
    const extracted = transcript.substring(startPosition).trim();
    console.log("[EXTRACT_QUERY SUCCESS] Extracted query:", extracted);
    return extracted;
  } catch (error) {
    console.error("[EXTRACT_QUERY ERROR] Error during query extraction:", error);
    return transcript; // Fallback to original transcript
  }
}

/**
 * Calls GPT-4o-mini to generate Zen Buddhist-style explanation
 */
async function getZenExplanation(query: string): Promise<string> {
  console.log("[GPT_CALL] Starting GPT-4o-mini API call for query:", query);
  
  try {
    if (!query || query.trim().length === 0) {
      console.warn("[GPT_CALL] Query is empty");
      throw new Error("Query cannot be empty");
    }
    
    console.log("[GPT_CALL] Preparing messages for GPT-4o-mini...");
    const messages = [
      {
        role: 'system' as const,
        content: `You are Satomi, a wise Zen Buddhist teacher who explains complex concepts with profound simplicity, mindfulness, and insight. Your explanations blend ancient wisdom with modern understanding. Use metaphors from nature, tea ceremonies, and daily mindful practice. Keep responses concise yet deeply meaningful. Format your responses with gentle structure and thoughtful emojis.`
      },
      {
        role: 'user' as const,
        content: `Please explain: ${query}`
      }
    ];
    
    console.log("[GPT_CALL] Messages prepared. Calling OpenAI API...");
    console.log("[GPT_CALL] Model: gpt-4o-mini");
    console.log("[GPT_CALL] Max tokens: 500");
    console.log("[GPT_CALL] Temperature: 0.7");
    
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
      max_tokens: 500,
      temperature: 0.7,
    });

    console.log("[GPT_CALL] API call successful. Processing response...");
    console.log("[GPT_CALL] Completion choices:", completion.choices?.length || 0);
    
    if (!completion.choices || completion.choices.length === 0) {
      console.error("[GPT_CALL ERROR] No choices returned from API");
      throw new Error("No response from GPT-4o-mini");
    }
    
    const explanation = completion.choices[0].message?.content || 'The answer resides in the silence between questions. 🍃';
    console.log("[GPT_CALL SUCCESS] Received explanation (length: " + explanation.length + " chars)");
    console.log("[GPT_CALL SUCCESS] Explanation:", explanation);
    
    return explanation;
  } catch (error) {
    console.error("[GPT_CALL ERROR] Error calling GPT-4o-mini:");
    
    if (error instanceof Error) {
      console.error("[GPT_CALL ERROR] Error name:", error.name);
      console.error("[GPT_CALL ERROR] Error message:", error.message);
      console.error("[GPT_CALL ERROR] Error stack:", error.stack);
    } else {
      console.error("[GPT_CALL ERROR] Unknown error type:", error);
    }
    
    throw new Error('Unable to generate explanation at this moment.');
  }
}

/**
 * Formats the Zen explanation for OMI display
 */
function formatZenResponse(query: string, explanation: string): string {
  console.log("[FORMAT] Starting Zen response formatting...");
  console.log("[FORMAT] Query:", query);
  console.log("[FORMAT] Explanation length:", explanation?.length || 0);
  
  try {
    if (!query || !explanation) {
      console.warn("[FORMAT] Query or explanation is missing");
      throw new Error("Cannot format incomplete response");
    }
    
    const formatted = `
🧘 Satomi's Wisdom

📿 Question:
${query}

🌸 Understanding:
${explanation}

---
Explained with mindful clarity by Satomi 🍵
  `.trim();
  
    console.log("[FORMAT SUCCESS] Formatted response (length: " + formatted.length + " chars)");
    console.log("[FORMAT SUCCESS] Formatted response:", formatted);
    return formatted;
  } catch (error) {
    console.error("[FORMAT ERROR] Error during response formatting:", error);
    return `🧘 Satomi's Wisdom\n\n${explanation}`; // Fallback format
  }
}

export async function POST(request: NextRequest) {
  console.log("\n[POST] ========================================");
  console.log("[POST] Received POST request to OMI webhook endpoint");
  console.log("[POST] Timestamp:", new Date().toISOString());
  console.log("[POST] ========================================\n");
  
  try {
    console.log("[POST] Parsing request body...");
    const body: OMIWebhookPayload = await request.json();
    console.log("[POST] Successfully parsed OMI payload");
    console.log("[POST] Raw payload:", JSON.stringify(body, null, 2));
    
    // Extract transcript from OMI segments array
    let transcript = '';
    
    console.log("[POST] Checking body.segments...");
    console.log("[POST] body.segments exists:", !!body.segments);
    console.log("[POST] body.segments is array:", Array.isArray(body.segments));
    console.log("[POST] body.segments length:", body.segments?.length || 0);
    
    if (body.segments && Array.isArray(body.segments) && body.segments.length > 0) {
      console.log("[POST] Extracting transcript from segments array...");
      
      transcript = body.segments
        .map((segment: { text: string }, index: number) => {
          console.log(`[POST] Segment ${index} text:`, segment.text);
          
          if (!segment.text) {
            console.warn(`[POST] Segment ${index} has no text`);
          }
          
          return segment.text || '';
        })
        .join(' ')
        .trim();
      
      console.log("[POST] Combined transcript from segments:", transcript);
    } else {
      console.log("[POST] Using fallback transcript extraction...");
      
      if (body.segments && body.segments[0]) {
        transcript = body.segments[0].text || '';
        console.log("[POST] Fallback transcript from segments[0]:", transcript);
      } else {
        console.warn("[POST] No segments available for transcript extraction");
        transcript = '';
      }
    }
    
    console.log("[POST] Final extracted transcript:", transcript);
    console.log("[POST] Transcript length:", transcript.length);
    
    // Extract session and user info
    const sessionId = body.session_id;
    const userId = body.segments && body.segments[0]?.person_id;
    
    console.log("[POST] Session ID:", sessionId);
    console.log("[POST] User ID:", userId);
    
    const webhookInfo = {
      transcript,
      sessionId,
      userId,
      segmentCount: body.segments?.length || 0,
      timestamp: new Date().toISOString(),
    };
    
    console.log("[POST] OMI webhook info:", JSON.stringify(webhookInfo, null, 2));

    // Check if transcript is empty
    if (!transcript || transcript.trim().length === 0) {
      console.log("[POST] Transcript is empty. Returning help message.");
      
      const helpResponse = {
        message: '🧘 Say "Hey Satomi" followed by any question about math, science, philosophy, or life. I will explain it with Zen wisdom.',
      };
      
      console.log("[POST] Returning help response:", helpResponse);
      return NextResponse.json(helpResponse);
    }

    // Check for wake word
    console.log("[POST] Checking for wake word detection...");
    const wakeWordDetected = isWakeWordDetected(transcript);
    
    if (!wakeWordDetected) {
      console.log('[POST] Wake word not detected in transcript. Returning prompt message.');
      
      const promptResponse = {
        message: '🌸 Say "Hey Satomi" to ask me about:\n• Mathematics & Science\n• Physics (Newton\'s Laws, Quantum Theory)\n• Philosophy & Life\n• Technology & Nature\n...or anything else you wish to understand deeply.',
      };
      
      console.log("[POST] Returning prompt response:", promptResponse);
      return NextResponse.json(promptResponse);
    }

    console.log("[POST] Wake word detected! Extracting user query...");
    
    // Extract the user's query
    const userQuery = extractQuery(transcript);
    console.log("[POST] Extracted user query:", userQuery);
    console.log("[POST] User query length:", userQuery?.length || 0);

    if (!userQuery || userQuery.length === 0) {
      console.log('[POST] Wake word was detected but no question found after wake word.');
      
      const noQuestionResponse = {
        message: '🍃 You called upon me, but I did not hear your question. Please ask again after "Hey Satomi".',
      };
      
      console.log("[POST] Returning no-question response:", noQuestionResponse);
      return NextResponse.json(noQuestionResponse);
    }

    console.log("[POST] Valid query detected. Getting Zen explanation...");
    
    // Get Zen-style explanation from GPT-4o-mini
    const zenExplanation = await getZenExplanation(userQuery);
    console.log("[POST] Received Zen explanation from GPT");

    // Format the response
    console.log("[POST] Formatting final response...");
    const formattedMessage = formatZenResponse(userQuery, zenExplanation);

    const finalResponse = {
      message: formattedMessage,
      query: userQuery,
      timestamp: new Date().toISOString(),
    };

    console.log("[POST SUCCESS] Responding with final Zen message");
    console.log("[POST SUCCESS] Final response:", JSON.stringify(finalResponse, null, 2));
    console.log("[POST] ========================================\n");

    return NextResponse.json(finalResponse);

  } catch (error) {
    console.error("\n[POST ERROR] ========================================");
    console.error('[POST ERROR] Error in OMI webhook');
    console.error("[POST ERROR] Timestamp:", new Date().toISOString());
    
    if (error instanceof Error) {
      console.error("[POST ERROR] Error type:", error.constructor.name);
      console.error("[POST ERROR] Error name:", error.name);
      console.error("[POST ERROR] Error message:", error.message);
      console.error("[POST ERROR] Error stack:", error.stack);
    } else {
      console.error("[POST ERROR] Unknown error type:", typeof error);
      console.error("[POST ERROR] Error value:", error);
    }
    
    console.error("[POST ERROR] ========================================\n");
    
    const errorResponse = {
      message: '⛩️ The path to understanding is temporarily clouded. Please try again, and I shall guide you.',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    };
    
    console.error("[POST ERROR] Sending error response:", errorResponse);
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}

// Optional: GET endpoint for webhook verification
export async function GET() {
  console.log("\n[GET] ========================================");
  console.log("[GET] Received GET request to OMI webhook endpoint");
  console.log("[GET] Timestamp:", new Date().toISOString());
  console.log("[GET] Sending status and info...");
  
  try {
    const statusInfo = {
      status: 'active',
      service: 'Satomi - Zen Buddhist AI Teacher',
      description: 'OMI integration for mindful explanations of any topic',
      version: '2.0.0',
      wake_words: WAKE_WORDS,
      timestamp: new Date().toISOString(),
    };
    
    console.log("[GET SUCCESS] Status info:", JSON.stringify(statusInfo, null, 2));
    console.log("[GET] ========================================\n");
    
    return NextResponse.json(statusInfo);
  } catch (error) {
    console.error("[GET ERROR] Error in GET handler:", error);
    console.error("[GET ERROR] ========================================\n");
    
    return NextResponse.json({
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
