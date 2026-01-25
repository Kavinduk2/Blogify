import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner = ({ size = 'default', fullScreen = false, message = 'Loading...' }) => {
  const sizeClasses = {
    small: 'w-4 h-4',
    default: 'w-8 h-8',
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  const spinnerSize = sizeClasses[size] || sizeClasses.default;

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50">
        <Loader2 className={`${spinnerSize} text-blue-500 animate-spin`} />
        {message && (
          <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12">
      <Loader2 className={`${spinnerSize} text-blue-500 animate-spin`} />
      {message && (
        <p className="mt-4 text-gray-600 font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;
