using noava.DTOs.Response;
using noava.Repositories.Contracts;
using noava.Services.Contracts;

namespace noava.Services.Implementations
{
    public class DeckOwnershipService : IDeckOwnershipService
    {
        private readonly IDeckUserRepository _userDeckRepo;
        private readonly IDeckRepository _deckRepo;

        public DeckOwnershipService(
            IDeckUserRepository userDeckRepo,
            IDeckRepository deckRepo)
        {
            _userDeckRepo = userDeckRepo;
            _deckRepo = deckRepo;
        }

        public async Task<List<DeckOwnerResponse>> GetOwnersForDeckAsync(int deckId, string clerkId)
        {
            var hasAccess = await _userDeckRepo.HasAccessAsync(deckId, clerkId);
            if (!hasAccess)
                throw new UnauthorizedAccessException("You don't have access to this deck");

            var owners = await _userDeckRepo.GetOwnersForDeckAsync(deckId);

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
            var isOwner = await _userDeckRepo.IsOwnerAsync(deckId, requestingClerkId);
            if (!isOwner)
                throw new UnauthorizedAccessException("Only owners can remove other owners");

            var deck = await _deckRepo.GetByIdAsync(deckId);
            if (deck == null)
                throw new InvalidOperationException("Deck not found");

            if (deck.UserId == ownerClerkId)
                throw new InvalidOperationException("Cannot remove the deck creator");

            var owners = await _userDeckRepo.GetOwnersForDeckAsync(deckId);
            if (owners.Count == 1 && owners[0].ClerkId == ownerClerkId)
                throw new InvalidOperationException("Cannot remove the last owner");

            return await _userDeckRepo.RemoveAsync(deckId, ownerClerkId);
        }

        public async Task<bool> IsOwnerAsync(int deckId, string clerkId)
        {
            return await _userDeckRepo.IsOwnerAsync(deckId, clerkId);
        }
    }
}