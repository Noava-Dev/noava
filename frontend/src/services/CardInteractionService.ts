import { useApi } from '../hooks/useApi';
import type { CardInteractionRequest, CardProgressResponse } from '../models/CardInteraction';

export const useCardInteractionService = () => {
  const api = useApi();

  return {
    async recordInteraction(
      studySessionId: number,
      deckId: number,
      cardId: number,
      request: CardInteractionRequest
    ): Promise<CardProgressResponse> {
      const response = await api.post<CardProgressResponse>(
        `/cardinteractions/${studySessionId}/${deckId}/${cardId}`,
        request
      );
      return response.data;
    },
  };
};
