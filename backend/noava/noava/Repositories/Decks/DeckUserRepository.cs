using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Decks;

namespace noava.Repositories.Implementations
{
    public class DeckUserRepository : IDeckUserRepository
    {
        private readonly NoavaDbContext _context;

        public DeckUserRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<DeckUser?> GetByDeckAndUserAsync(int deckId, string userId)
        {
            return await _context.DecksUsers
                .FirstOrDefaultAsync(du => du.DeckId == deckId && du.ClerkId == userId);
        }

        public async Task<List<DeckUser>> GetOwnersByDeckIdAsync(int deckId)
        {
            return await _context.DecksUsers
                .Where(du => du.DeckId == deckId && du.IsOwner)
                .ToListAsync();
        }

        public async Task<List<DeckUser>> GetByDeckIdAsync(int deckId)
        {
            return await _context.DecksUsers
                .Where(du => du.DeckId == deckId)
                .ToListAsync();
        }

        public async Task<int> GetOwnerCountAsync(int deckId)
        {
            return await _context.DecksUsers
                .Where(du => du.DeckId == deckId && du.IsOwner)
                .CountAsync();
        }

        public async Task<bool> IsOwnerAsync(int deckId, string userId)
        {
            return await _context.DecksUsers
                .AnyAsync(du => du.DeckId == deckId && du.ClerkId == userId && du.IsOwner);
        }

        public async Task<bool> HasAccessAsync(int deckId, string userId)
        {
            return await _context.DecksUsers
                .AnyAsync(du => du.DeckId == deckId && du.ClerkId == userId);
        }

        public async Task AddAsync(DeckUser deckUser)
        {
            await _context.DecksUsers.AddAsync(deckUser);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(DeckUser deckUser)
        {
            _context.DecksUsers.Remove(deckUser);
            await _context.SaveChangesAsync();
        }
    }
}