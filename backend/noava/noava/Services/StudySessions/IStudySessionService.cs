using noava.DTOs.StudySessions;
using noava.Models.Enums;

namespace noava.Services.StudySessions
{
    public interface IStudySessionService
    {
        Task<StudySessionResponse> StartSessionAsync(int deckId, string userId);
        Task<StudySessionResponse> EndSessionAsync(int sessionId, string userId, EndStudySessionRequest request);
        Task<StudySessionResponse> GetSessionAsync(int sessionId, string userId);
    }
}