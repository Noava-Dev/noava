export enum DeckVisibility {
  Public = 'Public',
  Shared = 'Shared',
  Private = 'Private',
}

export interface Deck {
  deckId: number;
  title: string;
  description?: string;
  language: string;
  visibility: DeckVisibility;
  coverImageBlobName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateDeckRequest {
  title: string;
  description?: string;
  language: string;
  visibility: DeckVisibility;
  coverImageBlobName?: string;
}

export interface UpdateDeckRequest {
  title: string;
  description?: string;
  language: string;
  visibility: DeckVisibility;
  coverImageBlobName?: string;
}
