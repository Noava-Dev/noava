import { useApi } from '../hooks/useApi';
import type {
  EndStudySessionRequest,
  StudySessionResponse,
} from '../models/StudySession';

export const useStudySessionService = () => {
  const api = useApi();

  return {
    async startSession(deckId: number): Promise<StudySessionResponse> {
      const response = await api.post<StudySessionResponse>(`/studysession/start/${deckId}`);
      return response.data;
    },

    async endSession(sessionId: number, request: EndStudySessionRequest): Promise<StudySessionResponse> {
      const response = await api.put<StudySessionResponse>(`/studysession/end/${sessionId}`, request);
      return response.data;
    },

    async getSession(sessionId: number): Promise<StudySessionResponse> {
      const response = await api.get<StudySessionResponse>(`/studysession/${sessionId}`);
      return response.data;
    },
  };
};