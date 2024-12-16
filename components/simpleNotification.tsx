import React, { useEffect, useState } from 'react';

interface NotificationProps {
  message: string;
  onClose: () => void;
  duration?: number; // Optional: Auto-close duration in milliseconds
}

const SimpleNotification: React.FC<NotificationProps> = ({ message, onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer); // Cleanup timer
  }, [onClose, duration]);

  return (
    <div className='fixed bottom-6 left-1/2 flex w-full max-w-sm -translate-x-1/2 transform items-center justify-between rounded-lg bg-primary-neutral-gray-800 px-6 py-3 text-white shadow-lg'>
      {/* Notification Text */}
      <span className='text-sm'>{message}</span>

      {/* Close Button */}
      <button
        onClick={onClose}
        className='ml-4 text-gray-400 hover:text-gray-200'
        aria-label='Close notification'
      >
        ✕
      </button>
    </div>
  );
};

export default SimpleNotification;
