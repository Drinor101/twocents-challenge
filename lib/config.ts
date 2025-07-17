
export const API_CONFIG = {

  baseUrl: 'https://api.twocents.money'
};


export const DEV_CONFIG = {

  LOG_API_CALLS: true,

  ENABLE_MOCK_FALLBACK: true,
  
  // Set to true to skip API calls entirely and use mock data immediately
  USE_MOCK_ONLY: true,

  MOCK_DELAY: 100 // Reduced from 500ms to 100ms for faster loading
}; 