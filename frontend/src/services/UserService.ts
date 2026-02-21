import { useApi } from '../hooks/useApi';

export const useUserService = () => {
  const api = useApi();

  return {
    async getEmailPreferences(): Promise<boolean> {
      const response = await api.get<boolean>('/users/email-preferences');
      return response.data ?? false;
    },

    async updateEmailPreferences(receive: boolean): Promise<void> {
      await api.put('/users/email-preferences', receive);
    },
  };
};