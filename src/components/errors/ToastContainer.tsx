"use client";

import React from 'react';
import { useToast } from '../../context/ToastContext';
import ToastNotification from './ToastNotification';

/**
 * Container component for displaying toast notifications
 */
const ToastContainer: React.FC = () => {
  const { toasts, showToast } = useToast();

  const handleClose = (id: number) => {
    // This will be handled by the ToastContext's timeout
  };

  return (
    <div className="fixed top-4 right-4 z-50 w-72">
      {toasts.map((toast) => (
        <ToastNotification
          key={toast.id}
          toast={toast}
          onClose={() => handleClose(toast.id)}
        />
      ))}
    </div>
  );
};

export default ToastContainer;