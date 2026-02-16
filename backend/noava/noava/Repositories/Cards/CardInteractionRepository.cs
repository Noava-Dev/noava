using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.Cards
{
    public class CardInteractionRepository : ICardInteractionRepository
    {
        private readonly NoavaDbContext _context;

        public CardInteractionRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<CardInteractions?> GetByIdAsync(int interactionId)
        {
            return await _context.CardInteractions
                .FirstOrDefaultAsync(ci => ci.Id == interactionId);
        }

        public async Task<List<CardInteractions>> GetByCardIdAsync(int cardId)
        {
            return await _context.CardInteractions
                .Where(ci => ci.CardId == cardId)
                .OrderByDescending(ci => ci.IntervalAfter)
                .ToListAsync();
        }

        public async Task<List<CardInteractions>> GetByUserIdAsync(string userId)
        {
            return await _context.CardInteractions
                .Where(ci => ci.ClerkId == userId)
                .OrderByDescending(ci => ci.IntervalAfter)
                .ToListAsync();
        }

        public async Task<List<CardInteractions>> GetBySessionIdAsync(int sessionId)
        {
            return await _context.CardInteractions
                .Where(ci => ci.StudySessionId == sessionId)
                .OrderBy(ci => ci.IntervalAfter)
                .ToListAsync();
        }

        public async Task<CardInteractions?> GetLatestInteractionAsync(int cardId, string userId)
        {
            return await _context.CardInteractions
                .Where(ci => ci.CardId == cardId && ci.ClerkId == userId)
                .OrderByDescending(ci => ci.IntervalAfter)
                .FirstOrDefaultAsync();
        }

        public async Task<CardInteractions> CreateAsync(CardInteractions interaction)
        {
            _context.CardInteractions.Add(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }

        public async Task<CardInteractions> UpdateAsync(CardInteractions interaction)
        {
            _context.CardInteractions.Update(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }

        public async Task<bool> DeleteAsync(int interactionId)
        {
            var interaction = await GetByIdAsync(interactionId);
            if (interaction == null) return false;

            _context.CardInteractions.Remove(interaction);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}