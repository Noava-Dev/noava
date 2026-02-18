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
  showSuccess: (title: string, message: string) => void;
  showError: (title: string, message: string) => void;
  showWarning: (title: string, message: string) => void;
  showInfo: (title: string, message: string) => void;
  showToast: (type: ToastType, title: string, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: ToastType, title: string, message: string) => {
    setToast({ type, message, title });
    setTimeout(() => setToast(null), 4000); // Auto-hide after 4 seconds
  };

  const showSuccess = (title: string, message: string) => showToast('success', title, message);
  const showError = (title: string, message: string) => showToast('error', title, message);
  const showWarning = (title: string, message: string) => showToast('warning', title, message);
  const showInfo = (title: string, message: string) => showToast('info', title, message);

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