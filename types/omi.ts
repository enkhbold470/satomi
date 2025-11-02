/**
 * OMI API Type Definitions
 * 
 * Based on actual OMI webhook payload structure
 */

/**
 * Individual segment from OMI transcription
 */
export interface OMISegment {
  id: string;
  text: string;
  speaker: string;
  speaker_id: number;
  is_user: boolean;
  person_id: string | null;
  start: number;
  end: number;
  translations: string[];
  speech_profile_processed: boolean;
}

/**
 * OMI webhook payload for real-time transcripts
 */
export interface OMIWebhookPayload {
  session_id: string;
  segments: OMISegment[];
}

/**
 * OMI memory creation payload
 */
export interface OMIMemoryPayload {
  memory_id: string;
  session_id: string;
  segments: OMISegment[];
  created_at: string;
  summary?: string;
}

/**
 * Processed transcript from OMI segments
 */
export interface ProcessedTranscript {
  text: string;
  segmentCount: number;
  speakers: string[];
  duration: number;
}

/**
 * Helper function to extract text from OMI segments
 */
export function extractTextFromSegments(segments: OMISegment[]): string {
  if (!segments || segments.length === 0) {
    return '';
  }
  
  return segments
    .map(segment => segment.text)
    .join(' ')
    .trim();
}

/**
 * Helper function to process OMI payload
 */
export function processOMIPayload(payload: OMIWebhookPayload): ProcessedTranscript {
  const text = extractTextFromSegments(payload.segments);
  
  const speakers = [
    ...new Set(payload.segments.map(s => s.speaker))
  ];
  
  const duration = payload.segments.length > 0
    ? payload.segments[payload.segments.length - 1].end - payload.segments[0].start
    : 0;
  
  return {
    text,
    segmentCount: payload.segments.length,
    speakers,
    duration,
  };
}

