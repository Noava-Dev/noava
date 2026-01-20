import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import CustomToast from '../shared/components/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  type: ToastType;
  title: string;
  message: string;
}

interface ToastContextType {
  showSuccess: (message: string, title: string) => void;
  showError: (message: string, title: string) => void;
  showWarning: (message: string, title: string) => void;
  showInfo: (message: string, title: string) => void;
  showToast: (type: ToastType, message: string, title: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: ToastType, message: string, title: string) => {
    setToast({ type, message, title });
    setTimeout(() => setToast(null), 4000); // Auto-hide after 4 seconds
  };

  const showSuccess = (message: string, title: string) => showToast('success', message, title);
  const showError = (message: string, title: string) => showToast('error', message, title);
  const showWarning = (message: string, title: string) => showToast('warning', message, title);
  const showInfo = (message: string, title: string) => showToast('info', message, title);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo, showToast }}>
      {children}
      {toast && (
        <CustomToast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
}