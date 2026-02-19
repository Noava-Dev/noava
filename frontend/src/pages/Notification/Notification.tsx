import { useEffect, useState } from 'react';
import { Card, Button, Tooltip } from 'flowbite-react';
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
import PageHeader from '../../shared/components/PageHeader';
import Loading from '../../shared/components/loading/Loading';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const service = notificationService();
  const { t } = useTranslation('notification');
  const api = useApi();
  const { showError, showSuccess } = useToast();

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
      showError(t('errors.params'), t('common:app.error'));
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
      showError(t('errors.fetch'), t('common:app.error'));
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
      showError(t('errors.delete'), t('common:app.error'));
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

      await api.request({
        method: action.method,
        url: `${import.meta.env.VITE_API_BASE_URL}${action.endpoint}`
      });

      await service.deleteNotification(notification.id);
      setNotifications((prev) => prev.filter((n) => n.id !== notification.id));
    } catch (error) {
      showError(t('errors.action'), t('common:app.error'));
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <Loading />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
          <PageHeader>
            <div className="pt-4 md:pt-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                    {t('common:navigation.notifications')}
                  </h1>
                </div>
              </div>
            </div>
          </PageHeader>

          <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
            <div className="container px-4 mx-auto max-w-7xl">
              {notifications.length === 0 ? (
                <div className="text-center text-text-muted-light dark:text-text-muted-dark">
                  {t('empty')}
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((n) => (
                    <Card
                      key={n.id}
                      className="box-border max-w-full min-w-0 overflow-hidden transition-colors duration-300 bg-background-app-light border border-border-strong rounded-lg shadow-md dark:bg-background-surface-dark dark:border-border-dark">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div>
                            <div className="text-lg font-semibold text-text-title-light md:text-xl dark:text-text-title-dark">
                              {t(n.titleKey)}
                            </div>
                            <div className="mt-1 text-xs text-text-muted-light md:text-sm dark:text-text-muted-dark">
                              {formatDateToEuropean(n.createdAt)}
                            </div>
                          </div>

                          <div className="mt-2 text-base text-text-body-light dark:text-text-body-dark break-words break-all whitespace-normal ">
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
                              className="inline-flex items-center p-0 text-text-muted-light dark:text-text-muted-dark bg-transparent border-0 rounded-none hover:text-red-500 dark:hover:text-red-500 hover:bg-transparent focus:outline-none focus:ring-0 focus:ring-transparent hover:outline-none"
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
                            className="text-white whitespace-nowrap bg-primary-600 dark:text-white dark:hover:bg-primary-700"
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
          </section>
      </div>
    </div>
  );
};

export default NotificationPage;
