export enum StudySessionMode {
  WRITE = 0,
  FLIP = 1,
  REVERSE = 2,
}

export interface StartStudySessionRequest {
  deckId: number;
  mode: StudySessionMode;
}

export interface EndStudySessionRequest {
  totalCardsReviewed: number;
  correctAnswers: number;
}

export interface StudySessionResponse {
  sessionId: number;
  startTime: string;
  endTime: string;
  totalCards: number;
  correctCount: number;
}

export interface CardInteraction {
  id: number;
  cardId: number;
  clerkId: string;
  studySessionId: number;
  deckId: number;
  timestamp: string;
  isCorrect: boolean;
  responseTimeMs: number;
  studyMode: number;
  interactionType: number;
  intervalBefore: number;
  intervalAfter: number;
  dueAtBefore: string;
  dueAtAfter: string;
}