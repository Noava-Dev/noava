export interface DeckOwner {
  clerkId: string;
  deckId: number;
  isOwner: boolean;
  addedAt: string;
  userEmail: string;
  userName?: string;
}