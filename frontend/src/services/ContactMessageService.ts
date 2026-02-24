import { useApi } from '../hooks/useApi';
import type { ContactMessage, ContactMessageRequest } from '../models/ContactMessage';

export const useContactMessageService = () => {
  const api = useApi();

  return {
    async getAll(): Promise<ContactMessage[]> {
      const response = await api.get<ContactMessage[]>('/contactmessages');
      return response.data;
    },

    async getById(id: number): Promise<ContactMessage> {
      const response = await api.get<ContactMessage>(`/contactmessages/${id}`);
      return response.data;
    },

    async create(message: ContactMessageRequest): Promise<ContactMessage> {
      const response = await api.post<ContactMessage>('/contactmessages', message);
      return response.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/contactmessages/${id}`);
    },
  };
};
