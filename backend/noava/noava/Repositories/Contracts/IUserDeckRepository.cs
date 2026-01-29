using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface IUserDeckRepository
    {
        Task<List<UserDeck>> GetByDeckIdAsync(int deckId);
        Task<List<UserDeck>> GetByClerkIdAsync(string clerkId);
        Task<List<UserDeck>> GetOwnersForDeckAsync(int deckId);
        Task<UserDeck?> GetByDeckAndUserAsync(int deckId, string clerkId);
        Task<UserDeck> AddAsync(UserDeck userDeck);
        Task<bool> RemoveAsync(int deckId, string clerkId);
        Task<bool> IsOwnerAsync(int deckId, string clerkId);
        Task<bool> HasAccessAsync(int deckId, string clerkId);
    }
}