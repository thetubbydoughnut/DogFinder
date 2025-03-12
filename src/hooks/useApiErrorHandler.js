import { useState, useCallback, useRef } from 'react';

/**
 * A hook for handling API errors with automatic retry functionality.
 * 
 * @param {Object} options Configuration options
 * @param {number} options.maxRetries Maximum number of retry attempts (default: 3)
 * @param {number} options.initialDelay Initial delay in ms before retrying (default: 1000)
 * @param {number} options.backoffFactor Factor to increase delay on subsequent retries (default: 2)
 * @param {function} options.onMaxRetriesReached Callback when max retries is reached
 * @returns {Object} API error handler utilities
 */
const useApiErrorHandler = ({
  maxRetries = 3,
  initialDelay = 1000,
  backoffFactor = 2,
  onMaxRetriesReached = () => {},
} = {}) => {
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryTimeoutRef = useRef(null);

  /**
   * Handles API errors and implements retry logic
   * @param {Function} apiCall The API call function to execute and potentially retry
   * @param {Object} errorInfo Additional error information
   * @returns {Promise} The result of the API call
   */
  const handleApiError = useCallback(async (apiCall, errorInfo = {}) => {
    try {
      setIsRetrying(false);
      const result = await apiCall();
      // Clear error state on success
      setError(null);
      setRetryCount(0);
      return result;
    } catch (err) {
      // Determine error type
      let errorType = 'api';
      const errorMessage = err.message || 'An unknown error occurred';
      
      if (errorMessage.includes('network') || 
          errorMessage.includes('Network') || 
          errorMessage.includes('offline') ||
          errorMessage.includes('ECONNREFUSED') ||
          errorMessage.includes('ETIMEDOUT')) {
        errorType = 'network';
      }
      
      const enhancedError = {
        message: errorMessage,
        type: errorType,
        status: err.response?.status,
        data: err.response?.data,
        ...errorInfo
      };
      
      setError(enhancedError);
      throw enhancedError;
    }
  }, []);

  /**
   * Retries a failed API call with exponential backoff
   * @param {Function} apiCall The API call function to retry
   */
  const retryApiCall = useCallback(async (apiCall) => {
    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    
    if (retryCount >= maxRetries) {
      setIsRetrying(false);
      onMaxRetriesReached(error);
      return;
    }
    
    setIsRetrying(true);
    
    // Calculate the delay with exponential backoff
    const delay = initialDelay * Math.pow(backoffFactor, retryCount);
    
    retryTimeoutRef.current = setTimeout(async () => {
      try {
        const result = await apiCall();
        setError(null);
        setRetryCount(0);
        setIsRetrying(false);
        return result;
      } catch (err) {
        setRetryCount(prev => prev + 1);
        setIsRetrying(false);
      }
    }, delay);
  }, [retryCount, maxRetries, initialDelay, backoffFactor, error, onMaxRetriesReached]);

  /**
   * Clean up resources when the component unmounts
   */
  const cleanup = useCallback(() => {
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }
    setError(null);
    setRetryCount(0);
    setIsRetrying(false);
  }, []);

  return {
    error,
    retryCount,
    isRetrying,
    handleApiError,
    retryApiCall,
    clearError: () => setError(null),
    resetRetryCount: () => setRetryCount(0),
    cleanup
  };
};

export default useApiErrorHandler; 