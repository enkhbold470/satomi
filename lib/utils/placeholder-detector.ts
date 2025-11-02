/**
 * Placeholder Detection Utility
 * Identifies and removes common placeholder patterns from text content
 */

const PLACEHOLDER_PATTERNS = [
  // Common placeholder patterns
  /\[.*?\]/g,                          // [placeholder]
  /\{.*?\}/g,                          // {placeholder}
  /\<.*?\>/g,                          // <placeholder>
  /YOUR_.*?(?:\s|$)/gi,                // YOUR_NAME, YOUR_API_KEY, etc.
  /REPLACE.*?(?:\s|$)/gi,              // REPLACE_ME, REPLACE_WITH, etc.
  /TODO:.*$/gm,                        // TODO: comments
  /FIXME:.*$/gm,                       // FIXME: comments
  /XXX.*?(?:\s|$)/gi,                  // XXX placeholders
  /example\.com/gi,                    // example.com domains
  /lorem ipsum/gi,                     // Lorem ipsum text
  /\$\{.*?\}/g,                        // ${VARIABLE} style placeholders
  /\[\[.*?\]\]/g,                      // [[placeholder]]
  /___+/g,                             // Multiple underscores
  /\.\.\.+/g,                          // Multiple dots (ellipsis as placeholder)
];

const PLACEHOLDER_KEYWORDS = [
  'placeholder',
  'todo',
  'fixme',
  'changeme',
  'replaceme',
  'your_',
  'example',
  'test_',
  'dummy',
  'sample_',
];

/**
 * Detects if text contains placeholder content
 */
export function hasPlaceholders(text: string): boolean {
  if (!text) return false;

  // Check against patterns
  for (const pattern of PLACEHOLDER_PATTERNS) {
    if (pattern.test(text)) {
      return true;
    }
  }

  // Check against keywords
  const lowerText = text.toLowerCase();
  for (const keyword of PLACEHOLDER_KEYWORDS) {
    if (lowerText.includes(keyword)) {
      return true;
    }
  }

  return false;
}

/**
 * Removes placeholder content from text
 */
export function removePlaceholders(text: string): string {
  if (!text) return '';

  let cleaned = text;

  // Remove lines containing placeholder patterns
  const lines = cleaned.split('\n');
  const filteredLines = lines.filter(line => {
    const lowerLine = line.toLowerCase();
    
    // Remove lines with placeholder keywords
    for (const keyword of PLACEHOLDER_KEYWORDS) {
      if (lowerLine.includes(keyword)) {
        return false;
      }
    }
    
    return true;
  });

  cleaned = filteredLines.join('\n');

  // Apply pattern replacements
  for (const pattern of PLACEHOLDER_PATTERNS) {
    cleaned = cleaned.replace(pattern, '');
  }

  // Clean up extra whitespace
  cleaned = cleaned
    .replace(/\n{3,}/g, '\n\n')  // Multiple newlines to double
    .trim();

  return cleaned;
}

/**
 * Validates that content is ready for processing (no placeholders)
 */
export function validateContentForProcessing(text: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!text || text.trim().length === 0) {
    errors.push('Content is empty');
    return { valid: false, errors };
  }

  if (hasPlaceholders(text)) {
    errors.push('Content contains placeholder text that must be replaced');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Detects if a file is a README or LICENSE file
 */
export function isDocumentationFile(filename: string): boolean {
  const lower = filename.toLowerCase();
  return (
    lower.includes('readme') ||
    lower.includes('license') ||
    lower === 'license.md' ||
    lower === 'readme.md' ||
    lower === 'readme.me'
  );
}

