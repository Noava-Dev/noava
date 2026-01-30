using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Contracts;

namespace noava.Repositories.Implementations
{
    public class DeckUserRepository : IDeckUserRepository
    {
        private readonly NoavaDbContext _context;

        public DeckUserRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<List<DeckUser>> GetByDeckIdAsync(int deckId)
        {
            return await _context.DecksUsers
                .Include(ud => ud.User)
                .Where(ud => ud.DeckId == deckId)
                .OrderByDescending(ud => ud.IsOwner)
                .ThenBy(ud => ud.AddedAt)
                .ToListAsync();
        }

        public async Task<List<DeckUser>> GetByClerkIdAsync(string clerkId)
        {
            return await _context.DecksUsers
                .Include(ud => ud.Deck)
                .Where(ud => ud.ClerkId == clerkId)
                .ToListAsync();
        }

        public async Task<List<DeckUser>> GetOwnersForDeckAsync(int deckId)
        {
            return await _context.DecksUsers
                .Include(ud => ud.User)
                .Where(ud => ud.DeckId == deckId && ud.IsOwner)
                .ToListAsync();
        }

        public async Task<DeckUser?> GetByDeckAndUserAsync(int deckId, string clerkId)
        {
            return await _context.DecksUsers
                .FirstOrDefaultAsync(ud => ud.DeckId == deckId && ud.ClerkId == clerkId);
        }

        public async Task<DeckUser> AddAsync(DeckUser userDeck)
        {
            userDeck.AddedAt = DateTime.UtcNow;
            _context.DecksUsers.Add(userDeck);
            await _context.SaveChangesAsync();
            return userDeck;
        }

        public async Task<bool> RemoveAsync(int deckId, string clerkId)
        {
            var userDeck = await GetByDeckAndUserAsync(deckId, clerkId);
            if (userDeck == null) return false;

            _context.DecksUsers.Remove(userDeck);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsOwnerAsync(int deckId, string clerkId)
        {
            return await _context.DecksUsers
                .AnyAsync(ud => ud.DeckId == deckId && ud.ClerkId == clerkId && ud.IsOwner);
        }

        public async Task<bool> HasAccessAsync(int deckId, string clerkId)
        {
            return await _context.DecksUsers
                .AnyAsync(ud => ud.DeckId == deckId && ud.ClerkId == clerkId);
        }
    }
}