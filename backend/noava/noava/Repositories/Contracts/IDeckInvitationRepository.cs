using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface IDeckInvitationRepository
    {
        Task<DeckInvitation?> GetByIdAsync(int id);
        Task<List<DeckInvitation>> GetByDeckIdAsync(int deckId);
        Task<List<DeckInvitation>> GetPendingByDeckIdAsync(int deckId);
        Task<List<DeckInvitation>> GetByUserEmailAsync(string email);
        Task<List<DeckInvitation>> GetByClerkIdAsync(string clerkId);
        Task<List<DeckInvitation>> GetPendingForUserAsync(string clerkId);
        Task<DeckInvitation> AddAsync(DeckInvitation invitation);
        Task<DeckInvitation> UpdateAsync(DeckInvitation invitation);
        Task<bool> DeleteAsync(int id);
        Task<bool> ExistsAsync(int deckId, string email);
    }
}