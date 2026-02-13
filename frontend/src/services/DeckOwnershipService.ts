import { useApi } from '../hooks/useApi';
import type { DeckOwner } from '../models/DeckOwner';

export const useDeckOwnershipService = () => {
  const api = useApi();

  return {
    async getOwners(deckId: number): Promise<DeckOwner[]> {
      const response = await api.get<DeckOwner[]>(
        `/deckownership/deck/${deckId}/owners`
      );
      return response.data;
    },

    async removeOwner(deckId: number, ownerClerkId: string): Promise<void> {
      await api.delete(
        `/deckownership/deck/${deckId}/owner/${ownerClerkId}`
      );
    },

    async isOwner(deckId: number): Promise<boolean> {
      const response = await api.get<{ isOwner: boolean }>(
        `/deckownership/deck/${deckId}/is-owner`
      );
      return response.data.isOwner;
    }
  };
};