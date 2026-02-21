import { useApi } from '../hooks/useApi';
import type { DashboardStatistics, DeckStatistics } from '../models/Statistics';

export const useStatisticsService = () => {
  const api = useApi();

  return {
    async getGeneralStatistics(): Promise<DashboardStatistics> {
      const response = await api.get<DashboardStatistics>('/statistics');
      return response.data;
    },

    async getDeckStatistics(deckId: number): Promise<DeckStatistics> {
      const response = await api.get<DeckStatistics>(`/statistics/${deckId}`);
      return response.data;
    },
  };
};
