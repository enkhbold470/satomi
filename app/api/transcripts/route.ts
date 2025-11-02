import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

/**
 * GET /api/transcripts
 * 
 * Fetches transcripts from database, optionally filtered by sessionId
 */
export async function GET(request: NextRequest) {
  console.log("[GET] Fetching transcripts...");
  
  try {
    const searchParams = request.nextUrl.searchParams;
    const sessionId = searchParams.get('sessionId');
    const limit = parseInt(searchParams.get('limit') || '100');
    
    const where = sessionId ? { sessionId } : {};
    
    const transcripts = await prisma.transcript.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
    
    console.log(`[GET SUCCESS] Found ${transcripts.length} transcripts`);
    
    return NextResponse.json({
      transcripts,
      total: transcripts.length,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[GET ERROR] Failed to fetch transcripts:", error);
    
    return NextResponse.json({
      error: 'Failed to fetch transcripts',
      message: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}

