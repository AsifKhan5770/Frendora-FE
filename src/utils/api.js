import config from '../config/config';

// API utility functions
const API_BASE_URL = config.API_BASE_URL;

// Debug logging to help identify configuration issues
if (!API_BASE_URL) {
  console.error('❌ API_BASE_URL is not configured!');
  console.error('Please check your configuration or environment variables');
  console.error('Current config:', config);
}

// Authenticated fetch function
export const authenticatedFetch = async (endpoint, options = {}) => {
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please check your environment variables.');
  }
  
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
  if (!API_BASE_URL) {
    throw new Error('API_BASE_URL is not configured. Please check your environment variables.');
  }
  
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
  if (!config.UPLOAD_URL) {
    console.error('❌ Cannot generate upload URL: UPLOAD_URL is not configured');
    return '';
  }
  
  return `${config.UPLOAD_URL}/uploads/${filename}`;
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
