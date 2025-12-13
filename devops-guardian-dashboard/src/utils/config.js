// API Configuration - Using mock data mode for development
// To enable real APIs, edit these values directly
export const config = {
  // Kestra API Configuration
  kestra: {
    baseUrl: 'http://localhost:8080', // your-kestra-api-endpoint
    apiKey: '', // your-kestra-api-key
  },

  // CodeRabbit API Configuration
  coderabbit: {
    baseUrl: 'https://api.coderabbit.ai', // your-coderabbit-api-endpoint
    apiKey: '', // your-coderabbit-api-key
  },

  // Feature flags - set to false to use mock data
  features: {
    enableRealData: false, // set to true to use real APIs
  },
};

// Validate configuration
export const validateConfig = () => {
  const errors = [];

  if (!config.kestra.baseUrl) {
    errors.push('Kestra API base URL is required');
  }

  if (!config.kestra.apiKey) {
    errors.push('Kestra API key is required');
  }

  if (!config.coderabbit.baseUrl) {
    errors.push('CodeRabbit API base URL is required');
  }

  if (!config.coderabbit.apiKey) {
    errors.push('CodeRabbit API key is required');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
