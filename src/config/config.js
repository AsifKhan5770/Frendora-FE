// Configuration file for API endpoints
const config = {
  // API Base URL - must be set via environment variable
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
  
  // Upload URL - derived from API base URL
  UPLOAD_URL: process.env.REACT_APP_API_BASE_URL 
    ? process.env.REACT_APP_API_BASE_URL.replace('/api', '') 
    : '',
    
  // Environment detection
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  
  // Platform detection
  isVercel: process.env.VERCEL === '1' || window.location.hostname.includes('vercel.app'),
  isLocalhost: window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
};

// Debug logging and validation
if (config.isDevelopment) {
  console.log('🔧 Config loaded:', {
    API_BASE_URL: config.API_BASE_URL,
    UPLOAD_URL: config.UPLOAD_URL,
    NODE_ENV: process.env.NODE_ENV,
    REACT_APP_API_BASE_URL: process.env.REACT_APP_API_BASE_URL,
    Platform: config.isVercel ? 'Vercel' : config.isLocalhost ? 'Localhost' : 'Other',
    Hostname: window.location.hostname,
    Final_API_URL: config.API_BASE_URL
  });
  
  // Validation warnings
  if (!config.API_BASE_URL) {
    console.warn('⚠️ Could not determine API_BASE_URL');
    console.warn('📝 Create a .env file in Frendora-FE with:');
    console.warn('   REACT_APP_API_BASE_URL=http://localhost:3001/api');
    console.warn('🌐 For Vercel, set this environment variable in your dashboard');
  } else {
    console.log('✅ API_BASE_URL configured successfully:', config.API_BASE_URL);
  }
}

export default config;
