import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'transcripts.db');

let db: Database.Database | null = null;

/**
 * Get or create database connection
 */
export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    initializeSchema(db);
  }
  return db;
}

/**
 * Initialize database schema
 */
function initializeSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS transcripts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id TEXT NOT NULL,
      transcript TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      audio_file_path TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_session_id ON transcripts(session_id);
    CREATE INDEX IF NOT EXISTS idx_created_at ON transcripts(created_at);
  `);
}

/**
 * Close database connection
 */
export function closeDb() {
  if (db) {
    db.close();
    db = null;
  }
}

