import { useState, useCallback } from 'react';

/**
 * Custom hook for managing toast notifications
 * @returns {Object} - Object containing toast state and functions
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, type = 'info', duration = 3000) => {
    const id = Date.now();
    const newToast = { id, message, type, duration };

    setToasts((prev) => [...prev, newToast]);

    // Auto remove toast after duration
    setTimeout(() => {
      removeToast(id);
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const showSuccess = useCallback(
    (message, duration) => showToast(message, 'success', duration),
    [showToast]
  );

  const showError = useCallback(
    (message, duration) => showToast(message, 'error', duration),
    [showToast]
  );

  const showWarning = useCallback(
    (message, duration) => showToast(message, 'warning', duration),
    [showToast]
  );

  const showInfo = useCallback(
    (message, duration) => showToast(message, 'info', duration),
    [showToast]
  );

  return {
    toasts,
    showToast,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};

export default useToast;
