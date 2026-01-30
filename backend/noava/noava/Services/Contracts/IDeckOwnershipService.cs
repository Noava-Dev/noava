using noava.DTOs.Response;

namespace noava.Services.Contracts
{
    public interface IDeckOwnershipService
    {
        Task<List<DeckOwnerResponse>> GetOwnersForDeckAsync(int deckId, string clerkId);
        Task<bool> RemoveOwnerAsync(int deckId, string ownerClerkId, string requestingClerkId);
        Task<bool> IsOwnerAsync(int deckId, string clerkId);
    }
}