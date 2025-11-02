/**
 * Type Definitions for Satomi
 * Japanese Concept Learning Platform
 */

// Japanese Concept Types
export interface JapaneseConcept {
  name: string;
  pronunciation?: string;
  explanation: string;
  origin: string;
  application: string;
  fullResponse: string;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface ConversationHistory {
  messages: ConversationMessage[];
  conceptsCovered: string[];
}

// API Response Types
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
  timestamp: string;
}

// Content Processing Types
export type ProcessType = 'improve' | 'summarize' | 'analyze' | 'custom';

export interface ContentMetadata {
  filename?: string;
  fileType?: string;
  wordCount?: number;
  hasPlaceholders?: boolean;
}

// Validation Types
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// OpenAI Configuration Types
export interface OpenAIConfig {
  apiKey: string;
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

