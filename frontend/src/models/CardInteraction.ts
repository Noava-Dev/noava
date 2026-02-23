export enum StudyMode {
  SPACED = 0,
  QUICK = 1,
}

export interface CardInteractionRequest {
  Timestamp: string;
  IsCorrect: boolean;
  ResponseTimeMs: number;
  StudyMode: StudyMode;
}

export interface CardProgressResponse {
  id: number;
  cardId: number;
  nextReviewDate: string;
  boxNumber: number;
  lastReviewedAt: string;
  correctCount: number;
  incorrectCount: number;
  streak: number;
}
