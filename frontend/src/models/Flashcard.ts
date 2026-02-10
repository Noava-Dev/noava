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
  hasVoiceAssistant: boolean;
}

export interface CreateFlashcardRequest {
  frontText: string;
  backText: string;
  frontImage?: string;
  frontAudio?: string;
  backImage?: string;
  backAudio?: string;
  memo?: string;
  hasVoiceAssistant: boolean;
}

export interface UpdateFlashcardRequest {
  frontText: string;
  backText: string;
  frontImage?: string;
  frontAudio?: string;
  backImage?: string;
  backAudio?: string;
  memo?: string;
  hasVoiceAssistant: boolean;
}

export enum BulkReviewMode {
  None,
  ShufflePerDeck,
  ShuffleAll
}