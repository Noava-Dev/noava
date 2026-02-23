using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.Cards
{
    public class CardRepository : ICardRepository
    {
        private readonly NoavaDbContext _context;

        public CardRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Card>> GetByDeckIdAsync(int deckId)
        {
            return await _context.Cards
                .Where(c => c.DeckId == deckId)
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<Card?> GetByIdAsync(int id)
        {
            return await _context.Cards.FindAsync(id);
        }

        public async Task<Card> CreateAsync(Card card)
        {
            card.CreatedAt = DateTime.UtcNow;
            card.UpdatedAt = DateTime.UtcNow;

            _context.Cards.Add(card);
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<List<Card>> GetDueCardsByDeckIdAsync(int deckId, string userId, DateOnly today)
        {
            return await _context.Cards
                .Where(c => c.DeckId == deckId)
                .Where(c =>
                    !_context.CardProgress.Any(p =>
                        p.CardId == c.Id &&
                        p.ClerkId == userId
                    )
                    ||
                    _context.CardProgress.Any(p =>
                        p.CardId == c.Id &&
                        p.ClerkId == userId &&
                        p.NextReviewDate <= today
                    )
                )
                .OrderBy(c => c.CreatedAt)
                .ToListAsync();
        }

        public async Task<List<Card>> CreateBulkAsync(IEnumerable<Card> cards)
        {
            var now = DateTime.UtcNow;
            foreach (var card in cards)
            {
                card.CreatedAt = now;
                card.UpdatedAt = now;
            }

            _context.Cards.AddRange(cards);
            await _context.SaveChangesAsync();

            return cards.ToList();
        }

        public async Task<Card> UpdateAsync(Card card)
        {
            card.UpdatedAt = DateTime.UtcNow;

            _context.Cards.Update(card);
            await _context.SaveChangesAsync();
            return card;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var card = await GetByIdAsync(id);
            if (card == null) return false;

            _context.Cards.Remove(card);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}