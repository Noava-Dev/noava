using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.Cards
{
    public class CardProgressRepository : ICardProgressRepository
    {
        private readonly NoavaDbContext _context;

        public CardProgressRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<CardProgress?> GetByCardAndUserAsync(int cardId, string userId)
        {
            return await _context.CardProgress
                .FirstOrDefaultAsync(x => x.CardId == cardId && x.ClerkId == userId);
        }

        public async Task<CardProgress> CreateAsync(CardProgress progress)
        {
            await _context.CardProgress.AddAsync(progress);
            await _context.SaveChangesAsync();
            return progress;
        }

        public async Task<CardProgress> UpdateAsync(CardProgress progress)
        {
            _context.CardProgress.Update(progress);
            await _context.SaveChangesAsync();
            return progress;
        }
    }
}