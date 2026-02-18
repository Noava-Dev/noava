import { useApi } from '../hooks/useApi';
import type { Deck, DeckRequest } from '../models/Deck';
import type { ClerkUserResponse } from '../models/User';

export const useDeckService = () => {
  const api = useApi();

  return {
    async getAll(): Promise<Deck[]> {
      const response = await api.get<Deck[]>('/deck');
      return response.data;
    },

    async getMyDecks(limit?: number): Promise<Deck[]> {
      const response = await api.get<Deck[]>('/deck/user/all', {
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

     async getByMultipleIds(deckIds: number[]): Promise<Deck[]> {
          const params = new URLSearchParams();
          deckIds.forEach(id => params.append('ids', id.toString()));
          
          const response = await api.get<Deck[]>(`/deck/multiple?${params.toString()}`);
          console.log('Received decks for multiple IDs:', response.data);
          return response.data;
        },


      async getUsersByDeck(
            deckId: number,
            page = 1,
            pageSize = 50
          ): Promise<ClerkUserResponse[]> {
            const response = await api.get<ClerkUserResponse[]>(
              `/deck/${deckId}/users`,
              { params: { page, pageSize } }
            );
            return response.data;
          },

        async inviteByEmail(deckId: number, email: string, isOwner: boolean = false): Promise<Deck> {
          const response = await api.post<Deck>(
            `/deck/${deckId}/invite`,
            null,
            { params: { email, isOwner } } 
          );
          return response.data;
        },

       async joinByCode(joinCode: string, isOwner: boolean = false): Promise<Deck> {
        const response = await api.post<Deck>(
          `/deck/join/${joinCode}`,
          null,
          { params: { isOwner } } 
        );
        return response.data;
      },

        async updateJoinCode(deckId: number): Promise<Deck> {
          const response = await api.put<Deck>(`/deck/${deckId}/joincode`);
          return response.data;
        },

        async removeUser(deckId: number, targetUserId: string): Promise<Deck> {
          const response = await api.delete<Deck>(
            `/deck/${deckId}/users/${targetUserId}`
          );
          return response.data;
        },

        async copy(deckId: number): Promise<Deck> {
          const response = await api.post<Deck>(`/deck/${deckId}/copy`,);
          return response.data;
        },
      };
};
