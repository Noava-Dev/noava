using noava.Models;

namespace noava.Repositories.StudySessions
{
    public interface IStudySessionRepository
    {
        Task<StudySession?> GetByIdAsync(int sessionId);
        Task<List<StudySession>> GetByUserIdAsync(string userId);
        Task<List<StudySession>> GetByDeckIdAsync(int deckId);
        Task<StudySession> CreateAsync(StudySession session);
        Task<StudySession> UpdateAsync(StudySession session);
        Task<bool> DeleteAsync(int sessionId);
    }
}