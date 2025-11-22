// API Configuration for different environments
// Use location.hostname to detect environment
const isLocalhost = typeof window !== 'undefined' && 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');

export const API_CONFIG = {
  // Automatically detect environment and use appropriate API URL
  BASE_URL: isLocalhost
    ? 'http://localhost:5000/api'                 // Development (Local)
    : 'https://crednest-backend.onrender.com/api', // Production (Render)
  
  // Timeout settings
  TIMEOUT: 30000, // 30 seconds
  
  // Retry settings
  MAX_RETRIES: 3,
  
  // Environment info
  IS_PRODUCTION: !isLocalhost,
  IS_DEVELOPMENT: isLocalhost,
};

// Helper function to get the correct API URL
export const getApiUrl = (endpoint: string = '') => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Log current configuration (only in development)
if (API_CONFIG.IS_DEVELOPMENT) {
  console.log('🔧 API Configuration:', {
    baseUrl: API_CONFIG.BASE_URL,
    environment: API_CONFIG.IS_PRODUCTION ? 'production' : 'development',
    timeout: API_CONFIG.TIMEOUT
  });
}
