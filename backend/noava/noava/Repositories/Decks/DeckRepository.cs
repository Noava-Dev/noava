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
            var query = _context.Decks
                .Where(d =>
                    d.UserId == userId ||
                    _context.DeckInvitations.Any(di =>
                        di.DeckId == d.DeckId &&
                        di.InvitedUserClerkId == userId &&
                        di.Status == InvitationStatus.Accepted))
                .OrderByDescending(d => d.CreatedAt);

            if (limit.HasValue)
            {
                query = (IOrderedQueryable<Deck>)query.Take(limit.Value);
            }

            return await query.ToListAsync();
        }

        public async Task<Deck?> GetByIdAsync(int id)
        {
            return await _context.Decks
                .Include(d => d.DeckUsers)
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
            var directAccess = await _context.DecksUsers
                .AnyAsync(du => du.DeckId == deckId && du.ClerkId == userId);

            if (directAccess) return true;

            return await _context.ClassroomDecks
                .Where(cd => cd.DeckId == deckId)
                .AnyAsync(cd => cd.Classroom != null &&
                               cd.Classroom.ClassroomUsers.Any(cu => cu.UserId == userId));
        }

        public async Task<List<Deck>> GetByIdsAsync(IEnumerable<int> ids)
        {
            return await _context.Decks
                .Where(d => ids.Contains(d.DeckId))
                .ToListAsync();
        }

        public async Task<bool> HasAcceptedInvitationAsync(int deckId, string userId)
        {
            return await _context.DeckInvitations
                .AnyAsync(di =>
                    di.DeckId == deckId &&
                    di.InvitedUserClerkId == userId &&
                    di.Status == InvitationStatus.Accepted);
        }

        public async Task<Deck?> GetByJoinCodeAsync(string joinCode)
        {
            return await _context.Decks
                .Include(d => d.DeckUsers)
                .FirstOrDefaultAsync(d => d.JoinCode == joinCode);
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
                .CountAsync(du => du.DeckId == deckId && du.IsOwner);
        }

        public async Task<bool> IsOwnerAsync(int deckId, string userId)
        {
            return await _context.DecksUsers
                .AnyAsync(du => du.DeckId == deckId && du.ClerkId == userId && du.IsOwner);
        }

        public async Task<bool> HasAccessAsync(int deckId, string userId)
        {
            // User is owner or has accepted invitation
            return await _context.DecksUsers
                .AnyAsync(du => du.DeckId == deckId && du.ClerkId == userId)
                || await HasAcceptedInvitationAsync(deckId, userId);
        }

        public async Task AddAsync(DeckUser deckUser)
        {
            _context.DecksUsers.Add(deckUser);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAsync(DeckUser deckUser)
        {
            _context.DecksUsers.Remove(deckUser);
            await _context.SaveChangesAsync();
        }

        public async Task<List<Deck>> GetUserDecksWithAccessAsync(string userId, int? limit = null)
        {
            var query = _context.Decks
                .Where(d =>
                    // User created the deck
                    d.UserId == userId ||
                    // OR user has access via DeckUsers (owner OR invited)
                    d.DeckUsers.Any(du => du.ClerkId == userId))
                .OrderByDescending(d => d.CreatedAt)
                .AsQueryable();

            if (limit.HasValue)
            {
                query = query.Take(limit.Value);
            }

            return await query.ToListAsync();
        }
        public async Task UpdateDeckUserAsync(DeckUser deckUser)
        {
            _context.DecksUsers.Update(deckUser);
            await _context.SaveChangesAsync();
        }
    }
}