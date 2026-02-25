using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.DTOs.Statistics;
using noava.Models;
using noava.Models.AggregateStatistics;
using System;

namespace noava.Repositories.Statistics
{
    public class StatisticsRepository : IStatisticsRepository
    {
        private readonly NoavaDbContext _context;

        public StatisticsRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<DeckUserStatistics?> GetByDeckAndUserAsync(int deckId, string userId)
        {
            return await _context.DeckUserStatistics
                .Include(d => d.Deck)
                .Include(d => d.User)
                .FirstOrDefaultAsync(d => d.DeckId == deckId && d.ClerkId == userId);
        }

        public async Task<List<DeckUserStatistics>> GetByDecksAndUserAsync(IEnumerable<int> deckIds, string userId)
        {
            var ids = deckIds.Distinct().ToList();

            if (ids.Count == 0)
                return new List<DeckUserStatistics>();

            return await _context.DeckUserStatistics
                .AsNoTracking()
                .Include(d => d.Deck)
                .Include(d => d.User)
                .Where(d => d.ClerkId == userId && ids.Contains(d.DeckId))
                .ToListAsync();
        }

        public async Task<List<DeckUserStatistics>> GetGeneralStatsAsync(string userId)
        {
            return await _context.DeckUserStatistics
                .Include(d => d.Deck)
                .Include(d => d.User)
                .Where(d => d.ClerkId == userId)
                .ToListAsync();
        }

        public async Task<ClassroomStatistics?> GetByClassroomIdAsync(int classroomId)
        {
            return await _context.ClassroomStatistics
                .Include(s => s.ActiveUsers)
                .FirstOrDefaultAsync(s => s.ClassroomId == classroomId);
        }
    }
}