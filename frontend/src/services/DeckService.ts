import type { Deck, CreateDeckRequest, UpdateDeckRequest } from '../models/Deck';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const deckService = {
  async getAll(): Promise<Deck[]> {
    const response = await fetch(`${VITE_API_BASE_URL}/deck`);
    if (!response.ok) {
      throw new Error('Failed to fetch decks');
    }
    return response.json();
  },

  async getById(id: number): Promise<Deck> {
    const response = await fetch(`${VITE_API_BASE_URL}/deck/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch deck');
    }
    return response.json();
  },

  async create(deck: CreateDeckRequest): Promise<Deck> {
    const response = await fetch(`${VITE_API_BASE_URL}/deck`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deck),
    });
    if (!response.ok) {
      throw new Error('Failed to create deck');
    }
    return response.json();
  },

  async update(id: number, deck: UpdateDeckRequest): Promise<Deck> {
    const response = await fetch(`${VITE_API_BASE_URL}/deck/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deck),
    });
    if (!response.ok) {
      throw new Error('Failed to update deck');
    }
    return response.json();
  },

  async delete(id: number): Promise<void> {
    const response = await fetch(`${VITE_API_BASE_URL}/deck/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete deck');
    }
  },
};