// Utility functions for authentication

// Check if token is expired (basic check without verifying signature)
export const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const exp = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= exp;
  } catch (error) {
    return true; // If we can't parse, assume expired
  }
};

// Handle 401 response - clear token and trigger logout
export const handleUnauthorized = (onLogout?: () => void) => {
  localStorage.removeItem('adminToken');
  if (onLogout) {
    onLogout();
  } else {
    // If no callback provided, reload the page to trigger re-authentication
    window.location.reload();
  }
};

// Check token and handle expiration
export const validateToken = (token: string | null, onLogout?: () => void): boolean => {
  if (!token) {
    if (onLogout) onLogout();
    return false;
  }

  if (isTokenExpired(token)) {
    handleUnauthorized(onLogout);
    return false;
  }

  return true;
};
