import { getDb } from './db';

export interface Transcript {
  id: number;
  session_id: string;
  transcript: string;
  created_at: string;
  audio_file_path: string | null;
}

/**
 * Save a transcript to the database
 */
export function saveTranscript(
  sessionId: string,
  transcript: string,
  audioFilePath?: string
): Transcript {
  const db = getDb();
  
  const stmt = db.prepare(`
    INSERT INTO transcripts (session_id, transcript, audio_file_path)
    VALUES (?, ?, ?)
  `);
  
  const result = stmt.run(sessionId, transcript, audioFilePath || null);
  
  // Get the inserted row
  const getStmt = db.prepare('SELECT * FROM transcripts WHERE id = ?');
  const inserted = getStmt.get(result.lastInsertRowid) as Transcript;
  
  return inserted;
}

/**
 * Get all transcripts ordered by creation date (newest first)
 */
export function getAllTranscripts(): Transcript[] {
  const db = getDb();
  
  const stmt = db.prepare(`
    SELECT * FROM transcripts
    ORDER BY created_at DESC
  `);
  
  return stmt.all() as Transcript[];
}

/**
 * Get transcripts for a specific session
 */
export function getTranscriptsBySession(sessionId: string): Transcript[] {
  const db = getDb();
  
  const stmt = db.prepare(`
    SELECT * FROM transcripts
    WHERE session_id = ?
    ORDER BY created_at DESC
  `);
  
  return stmt.all(sessionId) as Transcript[];
}

/**
 * Get recent transcripts (last N transcripts)
 */
export function getRecentTranscripts(limit: number = 50): Transcript[] {
  const db = getDb();
  
  const stmt = db.prepare(`
    SELECT * FROM transcripts
    ORDER BY created_at DESC
    LIMIT ?
  `);
  
  return stmt.all(limit) as Transcript[];
}

