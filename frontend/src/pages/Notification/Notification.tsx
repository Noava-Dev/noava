import { useEffect, useState } from 'react';
import { Card, Button, Spinner, Tooltip } from 'flowbite-react';
import { notificationService } from '../../services/NotificationService';
import type {
  Notification,
  NotificationAction,
} from '../../models/Notification';
import { HiOutlineX } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useApi } from '../../hooks/useApi';
import { formatDateToEuropean } from '../../services/DateService';
import { useToast } from '../../contexts/ToastContext';
import { useAuth } from '@clerk/clerk-react';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const { getToken } = useAuth();
  const service = notificationService();
  const { t } = useTranslation('notification');
  const api = useApi();
  const { showError } = useToast();

  function parseParams(data?: any): Record<string, unknown> {
    if (!data) return {};
    try {
      let parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (typeof parsed === 'string') {
        try {
          parsed = JSON.parse(parsed);
        } catch {}
      }
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch (e) {
      showError(t('common:app.error'), t('errors.params'));
    }
    return {};
  }

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    setLoading(true);
    try {
      const data = await service.getNotification();
      setNotifications(data);
    } catch (error) {
      setNotifications([]);
      showError(t('common:app.error'), t('errors.fetch'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setProcessingId(id);
    const previous = notifications;
    setNotifications((prev) => prev.filter((n) => n.id !== id));

    try {
      await service.deleteNotification(id);
    } catch (error) {
      setNotifications(previous);
      showError(t('common:app.error'), t('errors.delete'));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleAction(
    notification: Notification,
    action: NotificationAction
  ) {
    setProcessingId(notification.id);
    try {
      await api.request({ method: action.method, url: action.endpoint });

      await service.deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      try {
        showError(t('common:app.error'), t('errors.action'));
      } catch {}
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="p-4 overflow-y-auto md:p-8">
        <div className="container box-border px-4 pt-6 pb-12 mx-auto">
          <h1 className="mb-6 text-2xl font-bold text-gray-900 md:text-3xl dark:text-white">
            {t('common:navigation.notifications')}
          </h1>

          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">
              {t('empty')}
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <Card
                  key={n.id}
                  className="box-border max-w-full min-w-0 overflow-hidden text-gray-900 transition-colors duration-300 bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 dark:text-gray-100 dark:shadow-xl">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div>
                        <div className="text-lg font-semibold text-gray-900 md:text-xl dark:text-white">
                          {t('notifications.genericTitle')}
                        </div>
                        <div className="mt-1 text-xs text-gray-500 md:text-sm dark:text-gray-400">
                          {formatDateToEuropean(n.createdAt)}
                        </div>
                      </div>

                      <div className="mt-2 text-base text-gray-800 break-words break-all whitespace-normal dark:text-gray-100">
                        {String(
                          t(n.templateKey, parseParams(n.parametersJson))
                        )}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Tooltip
                        content={t('common:actions.delete')}
                        placement="top">
                        <button
                          className="inline-flex items-center p-0 text-gray-400 bg-transparent border-0 rounded-none dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 hover:bg-transparent focus:outline-none focus:ring-0 focus:ring-transparent hover:outline-none"
                          onClick={() => handleDelete(n.id)}
                          disabled={processingId === n.id}>
                          <HiOutlineX size={20} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {n.link && (
                    <div className="w-full mt-3">
                      <a
                        href={n.link}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500 text-white rounded-full text-sm transition duration-200 shadow-sm hover:shadow-md hover:bg-primary-600 hover:text-white transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:hover:text-white dark:focus:ring-primary-700"
                        target="_blank"
                        rel="noopener noreferrer">
                        <span className="font-medium">
                          {t('common:actions.viewMore')}
                        </span>
                      </a>
                    </div>
                  )}

                  <div className="flex justify-end w-full gap-2 mt-4 overflow-auto">
                    {n.actions.map((action) => (
                      <Button
                        key={action.labelKey}
                        size="xs"
                        className="text-gray-800 bg-white border border-gray-200 whitespace-nowrap hover:bg-gray-100 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700 dark:border-transparent"
                        onClick={() => handleAction(n, action)}
                        disabled={processingId === n.id}>
                        {String(t(action.labelKey))}
                      </Button>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
