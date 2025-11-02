import { NextRequest, NextResponse } from 'next/server';
import { processContent } from '@/lib/actions/content-processor-action';

/**
 * Content Processing API Route
 * 
 * POST /api/process-content
 * 
 * Request body:
 * {
 *   "content": "text to process",
 *   "filename": "readme.md",  // optional
 *   "processType": "improve" | "summarize" | "analyze" | "custom",  // optional, defaults to "improve"
 *   "customPrompt": "custom system prompt"  // optional, used when processType is "custom"
 * }
 * 
 * Response:
 * {
 *   "success": true,
 *   "processedContent": "...",
 *   "originalContent": "...",
 *   "hadPlaceholders": false,
 *   "warnings": [...],
 *   "timestamp": "2025-11-01T..."
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { content, filename, processType, customPrompt } = body;

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        {
          success: false,
          error: 'Content is required and must be a string',
        },
        { status: 400 }
      );
    }

    const response = await processContent({
      content,
      filename,
      processType,
      customPrompt,
    });

    return NextResponse.json(response, {
      status: response.success ? 200 : 500,
    });
  } catch (error) {
    console.error('Error in content processing API:', error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
      },
      { status: 500 }
    );
  }
}

