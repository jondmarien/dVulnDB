"use client";

import React from 'react';
import { Toast } from '../../context/ToastContext';

interface ToastNotificationProps {
  toast: Toast;
  onClose: () => void;
}

/**
 * Component for displaying toast notifications with Solana error styling
 */
const ToastNotification: React.FC<ToastNotificationProps> = ({ toast, onClose }) => {
  // Define colors based on toast type
  const getTypeStyles = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-[#0dbc79] border-[#00ff41] text-black';
      case 'error':
        return 'bg-[#1a1a1a] border-[#ff3333] text-[#ff3333]';
      case 'info':
        return 'bg-[#1a1a1a] border-[#00b4d8] text-[#00b4d8]';
      case 'loading':
        return 'bg-[#1a1a1a] border-[#00ff41] text-[#00ff41]';
      default:
        return 'bg-[#1a1a1a] border-[#333] text-[#00ff41]';
    }
  };

  // Define icon based on toast type
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
        );
      case 'error':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'info':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zm-1 9a1 1 0 102 0v-5a1 1 0 00-2 0v5z" clipRule="evenodd" />
          </svg>
        );
      case 'loading':
        return (
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`flex items-center p-3 mb-3 rounded border ${getTypeStyles()} shadow-lg`}>
      <div className="mr-3">
        {getIcon()}
      </div>
      <div className="flex-grow">
        {toast.message}
      </div>
      <button onClick={onClose} className="ml-2 text-current hover:text-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

export default ToastNotification;