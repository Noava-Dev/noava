import { useApi } from '../hooks/useApi';
import type { Flashcard, CreateFlashcardRequest, UpdateFlashcardRequest } from '../models/Flashcard';
import { BulkReviewMode } from '../models/Flashcard';

export const useFlashcardService = () => {
  const api = useApi();

  return {
    async getByDeckId(deckId: number): Promise<Flashcard[]> {
      const response = await api.get<Flashcard[]>(`/card/deck/${deckId}`);
      return response.data;
    },

    async getById(id: number): Promise<Flashcard> {
      const response = await api.get<Flashcard>(`/card/${id}`);
      return response.data;
    },

    async create(deckId: number, flashcard: CreateFlashcardRequest): Promise<Flashcard> {
      const response = await api.post<Flashcard>(`/card/deck/${deckId}`, flashcard);
      return response.data;
    },

    async update(id: number, flashcard: UpdateFlashcardRequest): Promise<Flashcard> {
      const response = await api.put<Flashcard>(`/card/${id}`, flashcard);
      return response.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/card/${id}`);
    },

    async getBulkReviewCards(deckIds: number[], mode: BulkReviewMode): Promise<Flashcard[]> {
      const params = new URLSearchParams();
      deckIds.forEach(id => params.append('deckIds', id.toString()));
      params.append('mode', mode.toString());
      
      const response = await api.get<Flashcard[]>(`/card/bulk-review?${params.toString()}`);
      return response.data;
    },
  };
};