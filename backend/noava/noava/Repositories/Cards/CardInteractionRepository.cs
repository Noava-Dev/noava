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

        public async Task<CardInteraction> CreateAsync(CardInteraction interaction)
        {
            await _context.CardInteractions.AddAsync(interaction);
            await _context.SaveChangesAsync();
            return interaction;
        }
    }
}