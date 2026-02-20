interface NotificationCount {
  count: number;
}

interface NotificationAction {
  labelKey: string;
  endpoint: string;
  method: "POST" | "PUT" | "DELETE" | "GET";
}

interface Notification {
  id: number;
  type: string;
  titleKey: string;
  templateKey: string;
  parametersJson: string;
  link: string | null;
  actions: NotificationAction[];
  createdAt: string;
}

export type { NotificationCount, Notification, NotificationAction };