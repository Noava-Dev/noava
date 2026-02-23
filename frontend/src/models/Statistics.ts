export interface DeckStatistics {
  deckId: number;
  cardsReviewed: number;
  correctCards: number;
  accuracyRate: number;
  timeSpentSeconds: number;
  avgResponseTimeMs: number;
  lastReviewedAt: string;
  avgMasteryLevel: number;
}

export interface ClassroomStatistics {
  classroomId: number;
  activeUsersCount: number;
  cardsReviewed: number;
  correctCards: number;
  timeSpentSeconds: number;
  avgMasteryLevel: number;
}

export interface DashboardStatistics {
  cardsReviewed: number;
  accuracyRate: number;
  timeSpentHours: number;
  lastRevieweDate: string | null;
}
