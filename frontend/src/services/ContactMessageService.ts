import { useApi } from '../hooks/useApi';
import type { ContactMessage, ContactMessageRequest, ContactMessageFilter, ContactMessageStatus } from '../models/ContactMessage';

export const useContactMessageService = () => {
  const api = useApi();

  return {
    async getAll(filter?: ContactMessageFilter): Promise<ContactMessage[]> {
      const params = new URLSearchParams();
      if (filter?.subject) params.append('subject', filter.subject);
      if (filter?.status) params.append('status', filter.status);
      
      const queryString = params.toString();
      const url = queryString ? `/contactmessages?${queryString}` : '/contactmessages';
      
      const response = await api.get<ContactMessage[]>(url);
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

    async updateStatus(id: number, status: ContactMessageStatus): Promise<ContactMessage> {
      const response = await api.patch<ContactMessage>(
        `/contactmessages/${id}/status?status=${status}`
      );
      return response.data;
    },
  };
};
