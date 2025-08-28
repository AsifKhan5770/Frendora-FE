// Utility function for making authenticated API calls
export const authenticatedFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  const isFormData = options && options.body instanceof FormData;

  const headers = {
    'Authorization': `Bearer ${token}`,
    ...options.headers
  };
  // Only set JSON Content-Type if not sending FormData and not already provided
  if (!isFormData && !('Content-Type' in headers)) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(url, {
    ...options,
    headers
  });

  // If token is invalid/expired, clear it and redirect to login
  if (response.status === 401) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Authentication failed. Please login again.');
  }

  return response;
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
