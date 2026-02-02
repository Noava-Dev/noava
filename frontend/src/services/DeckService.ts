import { useApi } from '../hooks/useApi';
import type { Deck, DeckRequest } from '../models/Deck';

export const useDeckService = () => {
  const api = useApi();

  return {
    async getAll(): Promise<Deck[]> {
      const response = await api.get<Deck[]>('/deck');
      return response.data;
    },

    async getMyDecks(limit?: number): Promise<Deck[]> {
      const response = await api.get<Deck[]>('/deck/user', {
        params: limit ? { limit } : undefined,
      });
      return response.data;
    },

    async getById(id: number): Promise<Deck> {
      const response = await api.get<Deck>(`/deck/${id}`);
      return response.data;
    },

    async create(deck: DeckRequest): Promise<Deck> {
      const response = await api.post<Deck>('/deck', deck);
      return response.data;
    },

    async update(id: number, deck: DeckRequest): Promise<Deck> {
      const response = await api.put<Deck>(`/deck/${id}`, deck);
      return response.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/deck/${id}`);
    },
  };
};
