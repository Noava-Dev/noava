using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Decks;

namespace noava.Repositories
{
    public class DeckRepository : IDeckRepository
    {
        private readonly NoavaDbContext _context;

        public DeckRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Deck>> GetAllAsync()
        {
            return await _context.Decks
                .OrderByDescending(d => d.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Deck>> GetByUserIdAsync(string userId, int? limit)
        {
            IQueryable<Deck> query = _context.Decks
                .Where(d => d.UserId == userId)
                .OrderByDescending(d => d.CreatedAt);

            if (limit.HasValue)
            {
                query = query.Take(limit.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Deck?> GetByIdAsync(int id)
        {
            return await _context.Decks
                .FirstOrDefaultAsync(d => d.DeckId == id);
        }

        public async Task<Deck> CreateAsync(Deck deck)
        {
            _context.Decks.Add(deck);
            await _context.SaveChangesAsync();
            return deck;
        }

        public async Task<Deck> UpdateAsync(Deck deck)
        {
            _context.Decks.Update(deck);
            await _context.SaveChangesAsync();
            return deck;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var deck = await _context.Decks.FindAsync(id);
            if (deck == null) return false;

            _context.Decks.Remove(deck);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsUserLinkedToDeckAsync(int deckId, string userId)
        {
            return await _context.ClassroomDecks
                .AnyAsync(du =>
                    du.DeckId == deckId &&
                    du.Classroom != null &&
                    du.Classroom.ClassroomUsers.Any(u => u.UserId == userId)
                );
        }
    }
}