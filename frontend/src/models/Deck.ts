export const DeckVisibility = {
  Public: 0,
  Shared: 1,
  Private: 2
} as const;

export type DeckVisibility = typeof DeckVisibility[keyof typeof DeckVisibility];

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