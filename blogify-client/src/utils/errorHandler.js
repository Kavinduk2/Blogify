// API error messages mapping
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error. Please check your internet connection.',
  TIMEOUT: 'Request timeout. Please try again.',
  UNAUTHORIZED: 'You are not authorized. Please log in.',
  FORBIDDEN: 'Access denied.',
  NOT_FOUND: 'Resource not found.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  SERVER_ERROR: 'Server error. Please try again later.',
  DEFAULT: 'Something went wrong. Please try again.'
};

// Parse API error response
export const parseError = (error) => {
  if (!error) return ERROR_MESSAGES.DEFAULT;
  
  // Network error
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }
  
  const { status, data } = error.response;
  
  // Handle specific status codes
  switch (status) {
    case 400:
      return data?.message || data?.errors?.[0]?.msg || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return data?.message || ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return data?.message || ERROR_MESSAGES.FORBIDDEN;
    case 404:
      return data?.message || ERROR_MESSAGES.NOT_FOUND;
    case 408:
      return ERROR_MESSAGES.TIMEOUT;
    case 500:
    case 502:
    case 503:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return data?.message || ERROR_MESSAGES.DEFAULT;
  }
};

// Handle async operations with error handling
export const asyncHandler = async (fn, errorCallback) => {
  try {
    return await fn();
  } catch (error) {
    const errorMessage = parseError(error);
    if (errorCallback) {
      errorCallback(errorMessage, error);
    }
    throw error;
  }
};

// Retry failed requests
export const retryRequest = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === retries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

export default {
  ERROR_MESSAGES,
  parseError,
  asyncHandler,
  retryRequest
};
