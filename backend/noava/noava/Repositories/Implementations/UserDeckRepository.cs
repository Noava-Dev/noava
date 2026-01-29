using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Interfaces;

namespace noava.Repositories
{
    public class UserDeckRepository : IUserDeckRepository
    {
        private readonly NoavaDbContext _context;

        public UserDeckRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<List<UserDeck>> GetByDeckIdAsync(int deckId)
        {
            return await _context.UserDecks
                .Include(ud => ud.User)
                .Where(ud => ud.DeckId == deckId)
                .OrderByDescending(ud => ud.IsOwner)
                .ThenBy(ud => ud.AddedAt)
                .ToListAsync();
        }

        public async Task<List<UserDeck>> GetByClerkIdAsync(string clerkId)
        {
            return await _context.UserDecks
                .Include(ud => ud.Deck)
                .Where(ud => ud.ClerkId == clerkId)
                .ToListAsync();
        }

        public async Task<List<UserDeck>> GetOwnersForDeckAsync(int deckId)
        {
            return await _context.UserDecks
                .Include(ud => ud.User)
                .Where(ud => ud.DeckId == deckId && ud.IsOwner)
                .ToListAsync();
        }

        public async Task<UserDeck?> GetByDeckAndUserAsync(int deckId, string clerkId)
        {
            return await _context.UserDecks
                .FirstOrDefaultAsync(ud => ud.DeckId == deckId && ud.ClerkId == clerkId);
        }

        public async Task<UserDeck> AddAsync(UserDeck userDeck)
        {
            userDeck.AddedAt = DateTime.UtcNow;
            _context.UserDecks.Add(userDeck);
            await _context.SaveChangesAsync();
            return userDeck;
        }

        public async Task<bool> RemoveAsync(int deckId, string clerkId)
        {
            var userDeck = await GetByDeckAndUserAsync(deckId, clerkId);
            if (userDeck == null) return false;

            _context.UserDecks.Remove(userDeck);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> IsOwnerAsync(int deckId, string clerkId)
        {
            return await _context.UserDecks
                .AnyAsync(ud => ud.DeckId == deckId && ud.ClerkId == clerkId && ud.IsOwner);
        }

        public async Task<bool> HasAccessAsync(int deckId, string clerkId)
        {
            return await _context.UserDecks
                .AnyAsync(ud => ud.DeckId == deckId && ud.ClerkId == clerkId);
        }
    }
}