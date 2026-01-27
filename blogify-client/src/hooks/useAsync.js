import { useState, useCallback } from 'react';
import { parseError } from '../utils/errorHandler';

/**
 * Custom hook for managing async operations with loading, error, and success states
 * @param {Function} asyncFunction - The async function to execute
 * @param {boolean} immediate - Whether to execute immediately on mount
 * @returns {Object} - Object containing execute function and states
 */
export const useAsync = (asyncFunction, immediate = false) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...params) => {
      setLoading(true);
      setError(null);

      try {
        const response = await asyncFunction(...params);
        setData(response);
        return response;
      } catch (err) {
        const errorMessage = parseError(err);
        setError(errorMessage);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [asyncFunction]
  );

  // Execute immediately if needed
  if (immediate) {
    execute();
  }

  return { execute, loading, data, error, setData, setError };
};

export default useAsync;
