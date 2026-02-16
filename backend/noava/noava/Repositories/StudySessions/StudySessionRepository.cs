using Microsoft.EntityFrameworkCore;
using noava.Data;

namespace noava.Repositories.StudySessions
{
    public class StudySessionRepository : IStudySessionRepository
    {
        private readonly NoavaDbContext _context;

        public StudySessionRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<Models.StudySessions?> GetByIdAsync(int sessionId)
        {
            return await _context.StudySessions
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        public async Task<List<Models.StudySessions>> GetByUserIdAsync(string userId)
        {
            return await _context.StudySessions
                .Where(s => s.ClerkId == userId)
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<List<Models.StudySessions>> GetByDeckIdAsync(int deckId)
        {
            return await _context.StudySessions
                .Where(s => s.DeckId == deckId)
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<Models.StudySessions> CreateAsync(Models.StudySessions session)
        {
            _context.StudySessions.Add(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<Models.StudySessions> UpdateAsync(Models.StudySessions session)
        {
            _context.StudySessions.Update(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<bool> DeleteAsync(int sessionId)
        {
            var session = await GetByIdAsync(sessionId);
            if (session == null) return false;

            _context.StudySessions.Remove(session);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}