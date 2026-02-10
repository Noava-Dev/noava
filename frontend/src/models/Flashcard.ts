export interface Flashcard {
  cardId: number;
  deckId: number;
  frontText: string;
  backText: string;
  frontImage?: string;
  frontAudio?: string;
  backImage?: string;
  backAudio?: string;
  memo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFlashcardRequest {
  frontText: string;
  backText: string;
  frontImage?: string;
  frontAudio?: string;
  backImage?: string;
  backAudio?: string;
  memo?: string;
}

export interface UpdateFlashcardRequest {
  frontText: string;
  backText: string;
  frontImage?: string;
  frontAudio?: string;
  backImage?: string;
  backAudio?: string;
  memo?: string;
}

export enum BulkReviewMode {
  None,
  ShufflePerDeck,
  ShuffleAll
}