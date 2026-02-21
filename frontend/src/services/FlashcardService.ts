import { useApi } from '../hooks/useApi';
import { ReviewMode } from '../models/Flashcard';
import type {
  Flashcard,
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
} from '../models/Flashcard';

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

    async create(
      deckId: number,
      flashcard: CreateFlashcardRequest
    ): Promise<Flashcard> {
      const response = await api.post<Flashcard>(
        `/card/deck/${deckId}`,
        flashcard
      );
      return response.data;
    },

    async createBulk(deckId: number, file: File): Promise<number> {
      try {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post<number>(
          `/card/deck/${deckId}/import`,
          formData,
          { headers: { 'Content-Type': 'multipart/form-data' } }
        );

        return response.data;
      } catch (error) {
        const message =
          (error as any)?.response?.data ??
          (error as any)?.message ??
          'Unexpected error';

        throw new Error(message);
      }
    },

    async update(
      id: number,
      flashcard: UpdateFlashcardRequest
    ): Promise<Flashcard> {
      const response = await api.put<Flashcard>(`/card/${id}`, flashcard);
      return response.data;
    },

    async delete(id: number): Promise<void> {
      await api.delete(`/card/${id}`);
    },

    async getBulkReviewCards(deckIds: number[], mode: ReviewMode): Promise<Flashcard[]> {
      const params = new URLSearchParams();
      deckIds.forEach(id => params.append('deckIds', id.toString()));
      params.append('mode', mode.toString());
      
      const response = await api.get<Flashcard[]>(`/card/bulk-review?${params.toString()}`);
      return response.data;
    },

    async getSpacedRepetitionCards(deckId: number, mode: ReviewMode): Promise<Flashcard[]> {
      const params = new URLSearchParams();
      params.append('mode', mode.toString());
      
      const response = await api.get<Flashcard[]>(`/card/${deckId}/spaced?${params.toString()}`);
      return response.data;
    },
  };
};