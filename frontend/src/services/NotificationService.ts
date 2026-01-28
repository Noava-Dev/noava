import { useApi } from "../hooks/useApi";
import type { NotificationCount } from "../models/Notification";
import type { Notification } from "../models/Notification";

export const notificationService = () => {
  const api = useApi();

  const getCount = async (): Promise<NotificationCount> => {
    try {
      const response = await api.get<NotificationCount>("/notifications/count");
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch notifications count");
    }
  };

  const getNotification = async (): Promise<Notification[]> => {
    try {
      const response = await api.get<Notification[]>("/notifications");
      return response.data;
    } catch (err) {
      throw new Error("Failed to fetch notifications");
    }
  };

  const deleteNotification = async (id: number): Promise<void> => {
    try {
      await api.delete<Notification[]>(`/notifications/${id}`);
    } catch (err) {
      throw new Error("Failed to delete notifications");
    }
  };

  return { getCount, getNotification, deleteNotification };
};