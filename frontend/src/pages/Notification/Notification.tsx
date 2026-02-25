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
import EmptyState from '../../shared/components/EmptyState';
import { PiBellSimpleZLight } from 'react-icons/pi';

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
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
      showError(t('errors.params'), t('common:app.error'));
    }
    return {};
  }


  function sanitizeLabel(value: string): string {
    return value.replace(/[^\p{L}\p{N}\s._:-]/gu, '').trim();
  }

  function collectStringFields(
    value: unknown,
    path: string[] = [],
    output: Array<{ path: string; value: string }> = []
  ): Array<{ path: string; value: string }> {
    if (value === null || value === undefined) return output;

    if (typeof value === 'string') {
      const normalized = value.trim();
      if (normalized) {
        output.push({ path: path.join('.').toLowerCase(), value: normalized });
      }
      return output;
    }

    if (Array.isArray(value)) {
      value.forEach((item, index) =>
        collectStringFields(item, [...path, String(index)], output)
      );
      return output;
    }

    if (typeof value === 'object') {
      Object.entries(value as Record<string, unknown>).forEach(([k, v]) =>
        collectStringFields(v, [...path, k], output)
      );
    }

    return output;
  }

  function interpolateTemplate(
    template: string,
    params: Record<string, unknown>
  ): string {
    const flattenedEntries: Array<[string, unknown]> = [];

    const flatten = (value: unknown, path: string[] = []) => {
      if (value === null || value === undefined) return;

      if (Array.isArray(value)) {
        value.forEach((item, index) => flatten(item, [...path, String(index)]));
        return;
      }

      if (typeof value === 'object') {
        for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
          flatten(v, [...path, k]);
        }
        return;
      }

      if (path.length > 0) {
        flattenedEntries.push([path.join('.'), value]);
        flattenedEntries.push([path[path.length - 1], value]);
      }
    };

    flatten(params);

    const valueMap = new Map<string, string>();
    const compactMap = new Map<string, string>();
    for (const [rawKey, rawValue] of flattenedEntries) {
      const key = rawKey.trim();
      if (!key) continue;
      const normalized = key.toLowerCase();
      const safeValue = String(rawValue ?? '');
      if (!valueMap.has(normalized)) {
        valueMap.set(normalized, safeValue);
      }
      const compactKey = normalized.replace(/[^a-z0-9]/g, '');
      if (compactKey && !compactMap.has(compactKey)) {
        compactMap.set(compactKey, safeValue);
      }
    }

    return template.replace(
      /\{\{\s*([^{}]+?)\s*\}\}|\{\s*([^{}]+?)\s*\}/g,
      (match, doubleKey, singleKey) => {
        const token = String(doubleKey ?? singleKey ?? '').trim();
        if (!token) return match;

        const direct = valueMap.get(token.toLowerCase());
        if (direct !== undefined) return direct;

        const compactToken = token.replace(/[^a-zA-Z0-9]/g, '').toLowerCase();
        const compact = compactMap.get(compactToken);
        if (compact !== undefined) return compact;

        return match;
      }
    );
  }

  function resolveNotificationMessage(notification: Notification): string {
    const params = parseParams(notification.parametersJson);
    const deckFromParams = params.deck as { name?: string } | undefined;
    const classroomFromParams = params.classroom as
      | { name?: string }
      | undefined;

    const deckName =
      (params.deckName as string | undefined) ??
      (params.deckTitle as string | undefined) ??
      (params.resourceName as string | undefined) ??
      deckFromParams?.name ??
      (params.name as string | undefined) ??
      'this Deck';

    const classroomName =
      (params.classroomName as string | undefined) ??
      (params.className as string | undefined) ??
      (params.resourceName as string | undefined) ??
      classroomFromParams?.name ??
      (params.name as string | undefined) ??
      'this Classroom';

    const allStrings = collectStringFields(params);
    const directUserName =
      (params.userName as string | undefined) ??
      (params.username as string | undefined) ??
      (params.senderName as string | undefined) ??
      (params.inviterName as string | undefined) ??
      (params.displayName as string | undefined) ??
      (params.fullName as string | undefined);

    const inferredUserName = allStrings.find(({ path, value }) => {
      if (!value) return false;
      if (value === deckName || value === classroomName) return false;
      const hasUserSignal = /(user|sender|inviter|from|owner|teacher|createdby|author)/i.test(path);
      const hasNameSignal = /(name|fullname|displayname)/i.test(path);
      return hasUserSignal || (hasNameSignal && /\./.test(path));
    })?.value;

    const userName = directUserName ?? inferredUserName ?? 'A user';

    const interpolationParams: Record<string, unknown> = {
      ...params,
      userName,
      username: userName,
      deckName,
      classroomName,
    };

    const translatedTemplate = String(t(notification.templateKey, interpolationParams));
    const templateOrFallback =
      translatedTemplate === notification.templateKey
        ? notification.templateKey.includes('.classroom.')
          ? t('notifications.items.classroom.invite.received', {
              ...interpolationParams,
            })
          : t('notifications.items.deck.invite.received', {
              ...interpolationParams,
            })
        : translatedTemplate;

    const interpolated = interpolateTemplate(templateOrFallback, interpolationParams);

    return interpolated
      .replace(/\{\{\s*userName\s*\}\}|\{\s*userName\s*\}/gi, userName)
      .replace(/\{\{\s*deckName\s*\}\}|\{\s*deckName\s*\}/gi, deckName)
      .replace(/\{\{\s*classroomName\s*\}\}|\{\s*classroomName\s*\}/gi, classroomName);
  }

  function resolveActionLabel(labelKey: string): string {
    const translated = String(t(labelKey));
    if (translated && translated !== labelKey) {
      return sanitizeLabel(translated);
    }

    const lastToken = labelKey.split('.').pop() ?? labelKey;
    const rootAction = String(t(`actions.${lastToken}`));
    if (rootAction && rootAction !== `actions.${lastToken}`) {
      return sanitizeLabel(rootAction);
    }

    return sanitizeLabel(lastToken.charAt(0).toUpperCase() + lastToken.slice(1));
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
        url: `${import.meta.env.VITE_API_BASE_URL}${action.endpoint}`,
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
              <EmptyState
                title={t('empty.title')}
                description={t('empty.message')}
                icon={PiBellSimpleZLight}
              />
            ) : (
              <div className="space-y-4">
                {notifications.map((n) => (
                  <Card
                    key={n.id}
                    className="box-border max-w-full min-w-0 overflow-hidden transition-colors duration-300 border rounded-lg shadow-md bg-background-app-light border-border-strong dark:bg-background-surface-dark dark:border-border-dark">
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

                        <div className="mt-2 text-base break-words break-all whitespace-normal text-text-body-light dark:text-text-body-dark ">
                          {resolveNotificationMessage(n)}
                        </div>
                      </div>

                      <div className="flex items-start">
                        <Tooltip
                          content={t('common:actions.delete')}
                          placement="top">
                          <button
                            className="inline-flex items-center p-0 bg-transparent border-0 rounded-none text-text-muted-light dark:text-text-muted-dark hover:text-red-500 dark:hover:text-red-500 hover:bg-transparent focus:outline-none focus:ring-0 focus:ring-transparent hover:outline-none"
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
                          {resolveActionLabel(action.labelKey)}
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
