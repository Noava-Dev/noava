using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface IDeckUserRepository
    {
        Task<List<DeckUser>> GetByDeckIdAsync(int deckId);
        Task<List<DeckUser>> GetByClerkIdAsync(string clerkId);
        Task<List<DeckUser>> GetOwnersForDeckAsync(int deckId);
        Task<DeckUser?> GetByDeckAndUserAsync(int deckId, string clerkId);
        Task<DeckUser> AddAsync(DeckUser userDeck);
        Task<bool> RemoveAsync(int deckId, string clerkId);
        Task<bool> IsOwnerAsync(int deckId, string clerkId);
        Task<bool> HasAccessAsync(int deckId, string clerkId);
    }
}