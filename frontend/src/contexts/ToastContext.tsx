import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import CustomToast from '../shared/components/Toast';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface ToastData {
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  showToast: (type: ToastType, message: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastData | null>(null);

  const showToast = (type: ToastType, message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000); // Auto-hide after 4 seconds
  };

  const showSuccess = (message: string) => showToast('success', message);
  const showError = (message: string) => showToast('error', message);
  const showWarning = (message: string) => showToast('warning', message);
  const showInfo = (message: string) => showToast('info', message);

  return (
    <ToastContext.Provider value={{ showSuccess, showError, showWarning, showInfo, showToast }}>
      {children}
      {toast && (
        <CustomToast
          type={toast.type}
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