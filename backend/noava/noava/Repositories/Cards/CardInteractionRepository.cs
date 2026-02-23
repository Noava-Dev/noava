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

        public async Task<List<InteractionCount>> GetInteractionsThisAndLastYearAsync(string clerkId)
        {
            var now = DateTime.UtcNow;
            var startOfLastYear = new DateTime(now.Year - 1, 1, 1);
            var endOfThisYear = new DateTime(now.Year, 12, 31, 23, 59, 59);

            return await _context.CardInteractions
                .Where(ci => ci.ClerkId == clerkId &&
                             ci.Timestamp >= startOfLastYear &&
                             ci.Timestamp <= endOfThisYear)
                .GroupBy(ci => ci.Timestamp.Date)
                .Select(g => new InteractionCount
                {
                    Date = g.Key,
                    Count = g.Count()
                })
                .OrderBy(x => x.Date)
                .ToListAsync();
        }
    }
}