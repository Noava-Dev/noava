import { useApi } from '../hooks/useApi';
import type { DeckInvitation } from '../models/DeckInvitation';

export const useDeckInvitationService = () => {
  const api = useApi();

  return {
    async inviteUser(deckId: number, userId: string): Promise<DeckInvitation> {
      const response = await api.post<DeckInvitation>(
        `/deckinvitation/deck/${deckId}/invite/${userId}`,
        {}
      );
      return response.data;
    },

    async getInvitationsForDeck(deckId: number): Promise<DeckInvitation[]> {
      const response = await api.get<DeckInvitation[]>(
        `/deckinvitation/deck/${deckId}`
      );
      return response.data;
    },

    async getPendingInvitations(): Promise<DeckInvitation[]> {
      const response = await api.get<DeckInvitation[]>('/deckinvitation/pending');
      return response.data;
    },

    async acceptInvitation(invitationId: number): Promise<DeckInvitation> {
      const response = await api.post<DeckInvitation>(
        `/deckinvitation/${invitationId}/accept`,
        {}
      );
      return response.data;
    },

    async declineInvitation(invitationId: number): Promise<DeckInvitation> {
      const response = await api.post<DeckInvitation>(
        `/deckinvitation/${invitationId}/decline`,
        {}
      );
      return response.data;
    },

    async cancelInvitation(invitationId: number): Promise<void> {
      await api.delete(`/deckinvitation/${invitationId}`);
    }
  };
};