using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.DTOs.Cards;
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

        public async Task<CardInteraction> CreateAsync(CardInteraction interaction)
        {
            await _context.CardInteractions.AddAsync(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }

        public async Task<List<InteractionCount>> GetInteractionsWholeYearAsync(string clerkId)
        {
            var todayUtc = DateTime.UtcNow.Date;
            var oneYearAgo = todayUtc.AddYears(-1);

            return await _context.CardInteractions
                .Where(ci => ci.ClerkId == clerkId &&
                             ci.Timestamp >= oneYearAgo &&
                             ci.Timestamp <= todayUtc.AddDays(1))
                .GroupBy(ci => ci.Timestamp.Date)
                .Select(g => new InteractionCount
                {
                    Date = DateTime.SpecifyKind(g.Key, DateTimeKind.Utc),
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();
        }

        public async Task<List<InteractionCount>> GetInteractionsWholeYearByDecksAsync(string clerkId, IEnumerable<int> deckIds)
        {
            if (deckIds == null || !deckIds.Any())
                return new List<InteractionCount>();

            var oneYearAgo = DateTime.UtcNow.AddYears(-1);

            return await _context.CardInteractions
                .Where(ci => ci.ClerkId == clerkId &&
                             deckIds.Contains(ci.DeckId) &&
                             ci.Timestamp >= oneYearAgo)
                .GroupBy(ci => ci.Timestamp.Date)
                .Select(g => new InteractionCount
                {
                    Date = DateTime.SpecifyKind(g.Key, DateTimeKind.Utc),
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();
        }
    }
}