using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Contracts;

namespace noava.Repositories.Implementations
{
    public class DeckInvitationRepository : IDeckInvitationRepository
    {
        private readonly NoavaDbContext _context;

        public DeckInvitationRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<DeckInvitation?> GetByIdAsync(int id)
        {
            return await _context.DeckInvitations
                .Include(i => i.Deck)
                .Include(i => i.InvitedBy)
                .FirstOrDefaultAsync(i => i.InvitationId == id);
        }

        public async Task<List<DeckInvitation>> GetByDeckIdAsync(int deckId)
        {
            return await _context.DeckInvitations
                .Include(i => i.InvitedBy)
                .Where(i => i.DeckId == deckId)
                .OrderByDescending(i => i.InvitedAt)
                .ToListAsync();
        }

        public async Task<List<DeckInvitation>> GetPendingByDeckIdAsync(int deckId)
        {
            return await _context.DeckInvitations
                .Include(i => i.InvitedBy)
                .Where(i => i.DeckId == deckId && i.Status == InvitationStatus.Pending)
                .OrderByDescending(i => i.InvitedAt)
                .ToListAsync();
        }

        public async Task<List<DeckInvitation>> GetByUserEmailAsync(string email)
        {
            return await _context.DeckInvitations
                .Include(i => i.Deck)
                .Include(i => i.InvitedBy)
                .Where(i => i.InvitedUserEmail == email)
                .OrderByDescending(i => i.InvitedAt)
                .ToListAsync();
        }

        public async Task<List<DeckInvitation>> GetByClerkIdAsync(string clerkId)
        {
            return await _context.DeckInvitations
                .Include(i => i.Deck)
                .Include(i => i.InvitedBy)
                .Where(i => i.InvitedUserClerkId == clerkId)
                .OrderByDescending(i => i.InvitedAt)
                .ToListAsync();
        }

        public async Task<List<DeckInvitation>> GetPendingForUserAsync(string clerkId)
        {
            return await _context.DeckInvitations
                .Include(i => i.Deck)
                .Include(i => i.InvitedBy)
                .Where(i => i.InvitedUserClerkId == clerkId && i.Status == InvitationStatus.Pending)
                .OrderByDescending(i => i.InvitedAt)
                .ToListAsync();
        }

        public async Task<DeckInvitation> AddAsync(DeckInvitation invitation)
        {
            invitation.InvitedAt = DateTime.UtcNow;
            _context.DeckInvitations.Add(invitation);
            await _context.SaveChangesAsync();
            return invitation;
        }

        public async Task<DeckInvitation> UpdateAsync(DeckInvitation invitation)
        {
            _context.DeckInvitations.Update(invitation);
            await _context.SaveChangesAsync();
            return invitation;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var invitation = await GetByIdAsync(id);
            if (invitation == null) return false;

            _context.DeckInvitations.Remove(invitation);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ExistsAsync(int deckId, string email)
        {
            return await _context.DeckInvitations
                .AnyAsync(i => i.DeckId == deckId &&
                              i.InvitedUserEmail == email &&
                              i.Status == InvitationStatus.Pending);
        }
    }
}