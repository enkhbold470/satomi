'use server';

import openai from '@/lib/openai';
import {
  removePlaceholders,
  validateContentForProcessing,
  isDocumentationFile,
} from '@/lib/utils/placeholder-detector';

/**
 * Generic Content Processing Server Action
 * 
 * Processes any text content through OpenAI API
 * Includes special handling for README and LICENSE files
 */

export interface ContentProcessRequest {
  content: string;
  filename?: string;
  processType?: 'improve' | 'summarize' | 'analyze' | 'custom';
  customPrompt?: string;
}

export interface ContentProcessResponse {
  success: boolean;
  processedContent?: string;
  originalContent?: string;
  hadPlaceholders?: boolean;
  warnings?: string[];
  error?: string;
  timestamp: string;
}

export async function processContent(
  request: ContentProcessRequest
): Promise<ContentProcessResponse> {
  try {
    const { content, filename, processType = 'improve', customPrompt } = request;

    // Check for placeholders
    const hadPlaceholders = removePlaceholders(content) !== content;
    const cleanedContent = removePlaceholders(content);
    
    // Validate content
    const validation = validateContentForProcessing(cleanedContent);
    const warnings: string[] = [];

    if (!validation.valid) {
      return {
        success: false,
        error: `Content validation failed: ${validation.errors.join(', ')}`,
        hadPlaceholders,
        warnings: validation.errors,
        timestamp: new Date().toISOString(),
      };
    }

    // Special handling for documentation files
    if (filename && isDocumentationFile(filename)) {
      warnings.push(
        `Detected documentation file: ${filename}. Ensuring no placeholder text is included.`
      );
      
      if (hadPlaceholders) {
        warnings.push('Placeholder text was detected and removed before processing.');
      }
    }

    // Build prompt based on process type
    let systemPrompt = '';
    let userPrompt = '';

    switch (processType) {
      case 'improve':
        systemPrompt = 'You are a professional technical writer. Improve the provided content while maintaining its core message and structure. Remove any placeholder text and make it production-ready.';
        userPrompt = `Please improve this content:\n\n${cleanedContent}`;
        break;
      
      case 'summarize':
        systemPrompt = 'You are a professional summarizer. Create a concise, accurate summary of the provided content.';
        userPrompt = `Please summarize this content:\n\n${cleanedContent}`;
        break;
      
      case 'analyze':
        systemPrompt = 'You are a content analyst. Analyze the provided content and provide insights, strengths, and areas for improvement.';
        userPrompt = `Please analyze this content:\n\n${cleanedContent}`;
        break;
      
      case 'custom':
        systemPrompt = customPrompt || 'You are a helpful assistant.';
        userPrompt = cleanedContent;
        break;
    }

    // Call OpenAI API
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const processedContent = completion.choices[0]?.message?.content || '';

    if (!processedContent) {
      return {
        success: false,
        error: 'No response generated from OpenAI',
        hadPlaceholders,
        warnings,
        timestamp: new Date().toISOString(),
      };
    }

    return {
      success: true,
      processedContent,
      originalContent: content,
      hadPlaceholders,
      warnings: warnings.length > 0 ? warnings : undefined,
      timestamp: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error in processContent:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Validates a file's content for production readiness
 * Specifically checks README and LICENSE files for placeholders
 */
export async function validateFileContent(
  filename: string,
  content: string
): Promise<{
  valid: boolean;
  errors: string[];
  warnings: string[];
  cleanedContent?: string;
}> {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Basic validation
  const validation = validateContentForProcessing(content);
  if (!validation.valid) {
    errors.push(...validation.errors);
  }

  // Check if it's a documentation file
  if (isDocumentationFile(filename)) {
    const cleanedContent = removePlaceholders(content);
    
    if (cleanedContent !== content) {
      warnings.push(
        'Documentation file contained placeholder text. Cleaned version provided.'
      );
    }

    // Additional checks for README/LICENSE
    if (filename.toLowerCase().includes('readme')) {
      if (content.length < 50) {
        warnings.push('README appears to be very short. Consider adding more detail.');
      }
    }

    if (filename.toLowerCase().includes('license')) {
      if (content.length < 100) {
        errors.push('LICENSE file appears to be incomplete or too short.');
      }
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
      cleanedContent,
    };
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

