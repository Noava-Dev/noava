using noava.Models;

namespace noava.Repositories.Decks
{
    public interface IDeckUserRepository
    {
        Task<DeckUser?> GetByDeckAndUserAsync(int deckId, string userId);
        Task<List<DeckUser>> GetOwnersByDeckIdAsync(int deckId);
        Task<List<DeckUser>> GetByDeckIdAsync(int deckId); 
        Task<int> GetOwnerCountAsync(int deckId);
        Task<bool> IsOwnerAsync(int deckId, string userId);
        Task<bool> HasAccessAsync(int deckId, string userId);
        Task AddAsync(DeckUser deckUser);
        Task RemoveAsync(DeckUser deckUser);
    }
}