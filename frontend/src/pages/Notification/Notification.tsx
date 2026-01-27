import { useEffect, useState } from "react";
import { Card, Button, Spinner, Tooltip } from "flowbite-react";
import { notificationService } from "../../services/NotificationService";
import type { Notification, NotificationAction } from "../../models/Notification";
import { HiOutlineX } from "react-icons/hi";
import { useTranslation } from 'react-i18next';
import { formatDateToEuropean } from "../../services/DateService";
import { useToast } from '../../contexts/ToastContext';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);


  const service = notificationService();
  const { t } = useTranslation('notification');
  const { showError } = useToast();

  function parseParams(data?: any): Record<string, unknown> {
    if (!data) return {};
    try {
      let parsed = typeof data === 'string' ? JSON.parse(data) : data;
      if (typeof parsed === 'string') {
        try { parsed = JSON.parse(parsed); } catch {}
      }
      if (typeof parsed === 'object' && parsed !== null) return parsed;
    } catch (e) {
      showError(t('errors.params'), t('errors.title'));
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
      showError(t('errors.fetch'), t('errors.title'));
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setProcessingId(id);
    const previous = notifications;
    setNotifications(prev => prev.filter(n => n.id !== id));

    try {
      await service.deleteNotification(id);
    } catch (error) {
      setNotifications(previous);
      showError(t('errors.delete'), t('errors.title'));
    } finally {
      setProcessingId(null);
    }
  }

  async function handleAction(notification: Notification, action: NotificationAction) {
    setProcessingId(notification.id);
    try {
      const response = await fetch(action.endpoint, { method: action.method });
      if (!response.ok) throw new Error("Action failed");

      await service.deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      try { showError(t('errors.action'), t('errors.title')); } catch {}
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="p-4 md:p-8 overflow-y-auto">
        <div className="container mx-auto px-4 box-border pt-6 pb-12">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-gray-900 dark:text-white">{t('title')}</h1>

          {notifications.length === 0 ? (
            <div className="text-center text-gray-500 dark:text-gray-400">{t('empty')}</div>
          ) : (
            <div className="space-y-4">
              {notifications.map((n) => (
                <Card
                  key={n.id}
                  className="min-w-0 transition-colors duration-300 overflow-hidden box-border max-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-100 rounded-lg shadow-md dark:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-baseline gap-2">
                        <div className="text-sm font-medium text-gray-700 dark:text-gray-200">{t('notifications.genericTitle')}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">-</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{formatDateToEuropean(n.createdAt)}</div>
                      </div>

                      <div className="mt-2 text-base text-gray-800 dark:text-gray-100 whitespace-normal break-words break-all">
                        {String(t(n.templateKey, parseParams(n.parametersJson)))}
                      </div>
                    </div>

                    <div className="flex items-start">
                      <Tooltip content={t('tooltip.delete')} placement="top">
                        <button
                          className="text-gray-400 dark:text-gray-300 hover:text-red-500 dark:hover:text-red-500 bg-transparent hover:bg-transparent p-0 rounded-none focus:outline-none focus:ring-0 focus:ring-transparent hover:outline-none border-0 inline-flex items-center"
                          onClick={() => handleDelete(n.id)}
                          disabled={processingId === n.id}
                          aria-label={t('aria.deleteNotification')}
                        >
                          <HiOutlineX size={20} />
                        </button>
                      </Tooltip>
                    </div>
                  </div>

                  {n.link && (
                    <div className="mt-3 w-full">
                      <a
                        href={n.link}
                        className="inline-flex items-center gap-2 px-3 py-1 bg-primary-500 text-white rounded-full text-sm hover:bg-primary-600 transition-shadow shadow-sm dark:shadow-none dark:bg-primary-600 dark:hover:bg-primary-700"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <span className="font-medium">{t('view')}</span>
                      </a>
                    </div>
                  )}

                  <div className="mt-4 w-full flex justify-end flex-wrap gap-2">
                    {n.actions.map((action) => (
                      <Button
                        key={action.labelKey}
                        size="xs"
                        className="whitespace-normal max-w-full break-words bg-white text-gray-800 hover:bg-gray-100 dark:bg-primary-600 dark:text-white dark:hover:bg-primary-700 border border-gray-200 dark:border-transparent"
                        onClick={() => handleAction(n, action)}
                        disabled={processingId === n.id}
                      >
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