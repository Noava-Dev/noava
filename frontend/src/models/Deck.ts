export enum DeckVisibility {
  Public = 'Public',
  Private = 'Private',
}

export interface Deck {
  deckId: number;
  userId: string;
  title: string;
  description: string;
  language: string;
  visibility: string;
  coverImageBlobName: string | null;
  joinCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeckRequest {
  title: string;
  description?: string;
  language: string;
  visibility: DeckVisibility;
  coverImageBlobName?: string;
}
