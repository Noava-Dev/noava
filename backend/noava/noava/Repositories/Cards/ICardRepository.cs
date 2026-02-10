using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardRepository
    {
        Task<List<Card>> GetByDeckIdAsync(int deckId);
        Task<Card?> GetByIdAsync(int id);
        Task<Card> CreateAsync(Card card);
        Task<List<Card>> CreateBulkAsync(IEnumerable<Card> card);
        Task<Card> UpdateAsync(Card card);
        Task<bool> DeleteAsync(int id);
    }
}