using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.StudySessions
{
    public class StudySessionRepository : IStudySessionRepository
    {
        private readonly NoavaDbContext _context;

        public StudySessionRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<StudySession?> GetByIdAsync(int sessionId)
        {
            return await _context.StudySessions
                .FirstOrDefaultAsync(s => s.Id == sessionId);
        }

        public async Task<List<StudySession>> GetByUserIdAsync(string userId)
        {
            return await _context.StudySessions
                .Where(s => s.ClerkId == userId)
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<List<StudySession>> GetByDeckIdAsync(int deckId)
        {
            return await _context.StudySessions
                .Where(s => s.DeckId == deckId)
                .OrderByDescending(s => s.StartTime)
                .ToListAsync();
        }

        public async Task<StudySession> CreateAsync(StudySession session)
        {
            _context.StudySessions.Add(session);
            await _context.SaveChangesAsync();
            return session;
        }

        public async Task<StudySession> UpdateAsync(StudySession session)
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