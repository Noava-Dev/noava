using noava.Models;

namespace noava.Repositories.Decks
{
    public interface IDeckRepository
    {
        Task<List<Deck>> GetAllAsync();
        Task<List<Deck>> GetByUserIdAsync(string userId, int? limit);
        Task<Deck?> GetByIdAsync(int id);
        Task<Deck> CreateAsync(Deck deck);
        Task<Deck> UpdateAsync(Deck deck);
        Task<bool> DeleteAsync(int id);
    }
}