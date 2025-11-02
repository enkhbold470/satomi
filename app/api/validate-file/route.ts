import { NextRequest, NextResponse } from 'next/server';
import { validateFileContent } from '@/lib/actions/content-processor-action';

/**
 * File Validation API Route
 * 
 * POST /api/validate-file
 * 
 * Validates file content, especially README and LICENSE files,
 * to ensure they don't contain placeholder text
 * 
 * Request body:
 * {
 *   "filename": "README.md",
 *   "content": "file content to validate"
 * }
 * 
 * Response:
 * {
 *   "valid": true,
 *   "errors": [],
 *   "warnings": [],
 *   "cleanedContent": "..." // if placeholders were found and removed
 * }
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { filename, content } = body;

    if (!filename || typeof filename !== 'string') {
      return NextResponse.json(
        {
          valid: false,
          errors: ['Filename is required and must be a string'],
          warnings: [],
        },
        { status: 400 }
      );
    }

    if (!content || typeof content !== 'string') {
      return NextResponse.json(
        {
          valid: false,
          errors: ['Content is required and must be a string'],
          warnings: [],
        },
        { status: 400 }
      );
    }

    const response = await validateFileContent(filename, content);

    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    console.error('Error in file validation API:', error);
    return NextResponse.json(
      {
        valid: false,
        errors: [error instanceof Error ? error.message : 'Internal server error'],
        warnings: [],
      },
      { status: 500 }
    );
  }
}

