"use client";
import { useToast } from '../../context/ToastContext';

const toastTypeIcon = {
  loading: '⏳',
  success: '✅',
  info: '📡',
};

const Toasts = () => {
  const { toasts } = useToast();
  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      pointerEvents: 'none',
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="notification notification--toast"
        >
          <span style={{ fontSize: 22 }}>{toastTypeIcon[toast.type]}</span>
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default Toasts; 