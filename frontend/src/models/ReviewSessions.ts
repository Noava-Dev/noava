export interface ReviewSession {
  deckId: number;
  deckTitle: string;
  cards: ReviewCard[];
  currentIndex: number;
  isFlipped: boolean;
  completedCards: number;
}

export interface ReviewCard {
  cardId: number;
  frontText: string;
  backText: string;
  frontImage?: string;
  frontAudio?: string;
  backImage?: string;
  backAudio?: string;
  memo?: string;
}