import axios from 'axios';
import type { DeckOwner } from '../models/DeckOwner';

const API_BASE_URL = import.meta.env.VITE_API_BASE_UR ;

export const deckOwnershipService = {
  async getOwners(deckId: number, token: string): Promise<DeckOwner[]> {
    const response = await axios.get(
      `${API_BASE_URL}/deckownership/deck/${deckId}/owners`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data;
  },

  async removeOwner(deckId: number, ownerClerkId: string, token: string): Promise<void> {
    await axios.delete(
      `${API_BASE_URL}/deckownership/deck/${deckId}/owner/${ownerClerkId}`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
  },

  async isOwner(deckId: number, token: string): Promise<boolean> {
    const response = await axios.get(
      `${API_BASE_URL}/deckownership/deck/${deckId}/is-owner`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );
    return response.data.isOwner;
  }
};