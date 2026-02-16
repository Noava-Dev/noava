using noava.Models;

namespace noava.Repositories.StudySessions
{
    public interface IStudySessionRepository
    {
        Task<Models.StudySessions?> GetByIdAsync(int sessionId);
        Task<List<Models.StudySessions>> GetByUserIdAsync(string userId);
        Task<List<Models.StudySessions>> GetByDeckIdAsync(int deckId);
        Task<Models.StudySessions> CreateAsync(Models.StudySessions session);
        Task<Models.StudySessions> UpdateAsync(Models.StudySessions session);
        Task<bool> DeleteAsync(int sessionId);
    }
}