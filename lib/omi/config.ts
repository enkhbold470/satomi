/**
 * OMI Integration Configuration
 * 
 * Configuration for Satomi's OMI wearable integration
 */

export const OMI_CONFIG = {
  // App metadata
  app: {
    name: 'Satomi - Japanese Concepts',
    description: 'Beautifully explained Japanese concepts delivered through conversation',
    version: '1.0.0',
    author: 'Satomi',
    category: 'Education & Learning',
    icon: '🇯🇵',
  },

  // Webhook endpoints (update with your deployed URL)
  webhooks: {
    transcript: '/api/omi/webhook',
    memory: '/api/omi/memory',
  },

  // Supported capabilities
  capabilities: [
    'real_time_transcript',
    'memory_creation',
    'conversation_processing',
  ],

  // Trigger keywords for Japanese concept detection
  triggers: [
    'ikigai',
    'wabi-sabi',
    'kaizen',
    'kintsugi',
    'mono no aware',
    'omotenashi',
    'what is',
    'explain',
    'tell me about',
    'japanese concept',
  ],

  // Response format settings
  response: {
    maxLength: 1500, // Max characters for OMI display
    includeEmoji: true,
    includeOrigin: true,
    includeApplication: true,
  },

  // Rate limiting (optional)
  rateLimit: {
    enabled: true,
    maxRequestsPerMinute: 10,
  },
};

/**
 * OMI app manifest for registration
 */
export const OMI_APP_MANIFEST = {
  id: 'satomi-japanese-concepts',
  name: OMI_CONFIG.app.name,
  description: OMI_CONFIG.app.description,
  version: OMI_CONFIG.app.version,
  author: OMI_CONFIG.app.author,
  
  // Integration type
  type: 'integration',
  
  // Webhook configuration
  webhook_url: '', // Set this to your deployed URL + /api/omi/webhook
  
  // Optional: OAuth configuration (if user-specific data needed)
  oauth: {
    required: false,
  },
  
  // App capabilities
  capabilities: OMI_CONFIG.capabilities,
  
  // Privacy and permissions
  privacy: {
    collects_data: true,
    data_types: ['transcripts', 'conversation_context'],
    data_usage: 'Processing Japanese concept queries',
    data_retention: 'No data stored long-term',
  },
  
  // Display settings
  display: {
    icon: OMI_CONFIG.app.icon,
    color: '#E63946', // Japanese red
    banner_text: 'Ask about Japanese concepts like Ikigai, Wabi-Sabi, Kaizen...',
  },
  
  // Example queries
  examples: [
    'What is ikigai?',
    'Explain wabi-sabi',
    'Tell me about kaizen',
    'What does mono no aware mean?',
    'Explain the concept of omotenashi',
  ],
};

export default OMI_CONFIG;

