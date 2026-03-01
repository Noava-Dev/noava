import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from 'react';
import { notificationService } from '../services/NotificationService';

interface NotificationContextType {
  notificationCount: number;
  refreshCount: () => Promise<void>;
  setNotificationCount: Dispatch<SetStateAction<number>>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

interface NotificationContextProps {
  children: ReactNode;
}

export const NotificationProvider = ({
  children,
}: NotificationContextProps) => {
  const [notificationCount, setNotificationCount] = useState(0);
  const { getCount } = notificationService();

  const refreshCount = async () => {
    try {
      const data = await getCount();
      if (data && typeof data.count === 'number') {
        setNotificationCount(data.count);
      } else {
        setNotificationCount(0);
      }
    } catch {
      setNotificationCount(0);
    }
  };

  useEffect(() => {
    refreshCount();
  }, []);

  return (
    <NotificationContext.Provider
      value={{ notificationCount, refreshCount, setNotificationCount }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }

  return context;
};
