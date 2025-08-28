// API utility functions
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://frendora-be.vercel.app/api');

// Debug logging for environment variables
console.log('Environment Variables Debug:');
console.log('REACT_APP_API_BASE_URL:', process.env.REACT_APP_API_BASE_URL);
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('Final API_BASE_URL:', API_BASE_URL);

// Authenticated fetch function
export const authenticatedFetch = async (endpoint, options = {}) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    throw new Error('No authentication token found');
  }

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions = {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Merge options, but let options.headers override default headers
  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  return fetch(url, finalOptions);
};

// Regular fetch function (for non-authenticated requests)
export const apiFetch = async (endpoint, options = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const finalOptions = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  };

  return fetch(url, finalOptions);
};

// Utility function to get upload URL with fallback
export const getUploadUrl = (filename) => {
  const baseUrl = process.env.REACT_APP_API_BASE_URL || 
    (window.location.hostname === 'localhost' ? 'http://localhost:3001/api' : 'https://frendora-be.vercel.app/api');
  return `${baseUrl.replace('/api', '')}/uploads/${filename}`;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// Logout function
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/';
};
