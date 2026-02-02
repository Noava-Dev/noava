using noava.DTOs.Decks;

namespace noava.Services.Decks
{
    public interface IDeckOwnershipService
    {
        Task<List<DeckOwnerResponse>> GetOwnersForDeckAsync(int deckId, string clerkId);
        Task<bool> RemoveOwnerAsync(int deckId, string ownerClerkId, string requestingClerkId);
        Task<bool> IsOwnerAsync(int deckId, string clerkId);
    }
}