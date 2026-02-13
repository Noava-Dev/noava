using noava.DTOs.Decks;
using noava.Repositories.Decks;
using noava.Services.Decks;

namespace noava.Services.Implementations
{
    public class DeckOwnershipService : IDeckOwnershipService
    {
        private readonly IDeckUserRepository _deckUserRepo;
        private readonly IDeckRepository _deckRepo;

        public DeckOwnershipService(
            IDeckUserRepository deckUserRepo,
            IDeckRepository deckRepo)
        {
            _deckUserRepo = deckUserRepo;
            _deckRepo = deckRepo;
        }

        public async Task<List<DeckOwnerResponse>> GetOwnersForDeckAsync(int deckId, string clerkId)
        {
            var hasAccess = await _deckUserRepo.HasAccessAsync(deckId, clerkId);
            if (!hasAccess)
                throw new UnauthorizedAccessException("You don't have access to this deck");

            var owners = await _deckUserRepo.GetOwnersByDeckIdAsync(deckId);

            return owners.Select(o => new DeckOwnerResponse
            {
                ClerkId = o.ClerkId,
                DeckId = o.DeckId,
                IsOwner = o.IsOwner,
                AddedAt = o.AddedAt,
            }).ToList();
        }

        public async Task<bool> RemoveOwnerAsync(int deckId, string ownerClerkId, string requestingClerkId)
        {
            var isOwner = await _deckUserRepo.IsOwnerAsync(deckId, requestingClerkId);
            if (!isOwner)
                throw new UnauthorizedAccessException("Only owners can remove other owners");

            var deck = await _deckRepo.GetByIdAsync(deckId);
            if (deck == null)
                throw new InvalidOperationException("Deck not found");

            if (deck.UserId == ownerClerkId)
                throw new InvalidOperationException("Cannot remove the deck creator");

            var owners = await _deckUserRepo.GetOwnersByDeckIdAsync(deckId);
            if (owners.Count == 1 && owners[0].ClerkId == ownerClerkId)
                throw new InvalidOperationException("Cannot remove the last owner");

            var deckUser = await _deckUserRepo.GetByDeckAndUserAsync(deckId, ownerClerkId);
            if (deckUser == null)
                throw new InvalidOperationException("Owner not found");

            await _deckUserRepo.RemoveAsync(deckUser);

            return true;
        }

        public async Task<bool> IsOwnerAsync(int deckId, string clerkId)
        {
            return await _deckUserRepo.IsOwnerAsync(deckId, clerkId);
        }
    }
}
