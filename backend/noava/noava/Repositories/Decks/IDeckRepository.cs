using noava.Models;

namespace noava.Repositories.Decks
{
    public interface IDeckRepository
    {
        Task<List<Deck>> GetAllAsync();
        Task<List<Deck>> GetByUserIdAsync(string userId, int? limit);
        Task<Deck?> GetByIdAsync(int id);
        Task<List<Deck>> GetByIdsAsync(IEnumerable<int> ids);
        Task<Deck> CreateAsync(Deck deck);
        Task<Deck> UpdateAsync(Deck deck);
        Task<bool> DeleteAsync(int id);
        Task<bool> IsUserLinkedToDeckAsync(int deckId, string userId);
        Task<bool> HasAcceptedInvitationAsync(int deckId, string userId);
        Task<Deck?> GetByJoinCodeAsync(string joinCode);
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