import { useApi } from '../hooks/useApi';
import type {
  ClassroomStatistics,
  DashboardStatistics,
  DeckStatistics,
  InteractionCount,
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

    async getDeckStatisticsByUser(
      deckIds: number[],
      classroomId: number,
      userId: string
    ): Promise<DeckStatistics> {
      const params = new URLSearchParams();
      deckIds.forEach(id => params.append('deckIds', id.toString()));
      params.append('classroomId', classroomId.toString());
      params.append('userId', userId);

      const response = await api.get<DeckStatistics>(`/statistics/decks/aggregate?${params.toString()}`);
      return response.data;
    },

    async getInteractionsYearly(): Promise<InteractionCount[]> {
      const response = await api.get<InteractionCount[]>('/statistics/interactions/yearly');
      return response.data;
    },

    async getInteractionsByDecksForClassroom(
      clerkId: string,
      classroomId: number,
      deckIds: number[]
    ): Promise<InteractionCount[]> {
      const params = new URLSearchParams();
      params.append('clerkId', clerkId);
      params.append('classroomId', classroomId.toString());
      deckIds.forEach(id => params.append('deckIds', id.toString()));

      const response = await api.get<InteractionCount[]>(
        `/statistics/interactions/by-decks/classroom/yearly?${params.toString()}`
      );
      return response.data;
    },
  };
};