import { NextRequest, NextResponse } from 'next/server';
import { getAllTranscripts, getRecentTranscripts } from '@/lib/db-transcripts';

/**
 * GET /api/transcripts
 * 
 * Returns all transcripts or recent transcripts
 * Query params:
 * - limit: number of recent transcripts to return (default: all)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const limitParam = searchParams.get('limit');
    
    let transcripts;
    
    if (limitParam) {
      const limit = parseInt(limitParam, 10);
      if (isNaN(limit) || limit <= 0) {
        return NextResponse.json(
          { error: 'Invalid limit parameter' },
          { status: 400 }
        );
      }
      transcripts = getRecentTranscripts(limit);
    } else {
      transcripts = getAllTranscripts();
    }
    
    return NextResponse.json({
      transcripts,
      count: transcripts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[TRANSCRIPTS API ERROR]', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch transcripts',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

