import axios from 'axios';
import type { DeckInvitation } from '../models/DeckInvitation';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ;

export const deckInvitationService = {
  async inviteUser(deckId: number, userId: string, token: string): Promise<DeckInvitation> {
    const response = await axios.post(
      `${API_BASE_URL}/deckinvitation/deck/${deckId}/invite`,
      { clerkId: userId },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getInvitationsForDeck(deckId: number, token: string): Promise<DeckInvitation[]> {
    const response = await axios.get(
      `${API_BASE_URL}/deckinvitation/deck/${deckId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async getPendingInvitations(token: string): Promise<DeckInvitation[]> {
    const response = await axios.get(
      `${API_BASE_URL}/deckinvitation/pending`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async acceptInvitation(invitationId: number, token: string): Promise<DeckInvitation> {
    const response = await axios.post(
      `${API_BASE_URL}/deckinvitation/${invitationId}/accept`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async declineInvitation(invitationId: number, token: string): Promise<DeckInvitation> {
    const response = await axios.post(
      `${API_BASE_URL}/deckinvitation/${invitationId}/decline`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async cancelInvitation(invitationId: number, token: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/deckinvitation/${invitationId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  }
};