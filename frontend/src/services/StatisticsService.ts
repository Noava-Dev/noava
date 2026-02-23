import { useApi } from '../hooks/useApi';
import type {
  ClassroomStatistics,
  DashboardStatistics,
  DeckStatistics,
} from '../models/Statistics';

export const useStatisticsService = () => {
  const api = useApi();

  return {
    async getGeneralStatistics(): Promise<DashboardStatistics> {
      const response = await api.get<DashboardStatistics>('/statistics');
      return response.data;
    },

    async getDeckStatistics(deckId: number): Promise<DeckStatistics> {
      const response = await api.get<DeckStatistics>(
        `/statistics/decks/${deckId}`
      );
      return response.data;
    },

    async getClassroomStatistics(
      classroomId: number
    ): Promise<ClassroomStatistics> {
      const response = await api.get<ClassroomStatistics>(
        `/statistics/classrooms/${classroomId}`
      );
      return response.data;
    },
  };
};
