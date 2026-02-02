using noava.Models;
using noava.Shared;
using noava.Models.BlobStorage;
using noava.DTOs.Decks;
using noava.Repositories.Decks;
using noava.Services.Decks;
using noava.Mappers.Decks;

namespace noava.Services
{
    public class DeckService : IDeckService
    {
        private readonly IDeckRepository _repository;
        IDeckUserRepository _deckUserRepo;
        private readonly IBlobService _blobService;

        public DeckService(IDeckRepository repository, IBlobService blobService, IDeckUserRepository deckUserRepo)
        {
            _repository = repository;
            _blobService = blobService;
            _deckUserRepo = deckUserRepo;
        }

        public async Task<List<DeckResponse>> GetAllDecksAsync()
        {
            var decks = await _repository.GetAllAsync();
            return decks.Select(d => d.ToResponseDto()).ToList();
        }

        public async Task<List<DeckResponse>> GetUserDecksAsync(string userId, int? limit = null)
        {
            var decks = await _repository.GetByUserIdAsync(userId, limit);
            return decks.Select(d => d.ToResponseDto()).ToList();
        }

        public async Task<DeckResponse?> GetDeckByIdAsync(int id)
        {
            var deck = await _repository.GetByIdAsync(id);
            if (deck == null) return null;
            return deck.ToResponseDto();
        }

        public async Task<DeckResponse> CreateDeckAsync(DeckRequest request, string userId)
        {
            var deck = new Deck
            {
                Title = request.Title,
                Description = request.Description,
                Language = request.Language,
                Visibility = request.Visibility,
                CoverImageBlobName = request.CoverImageBlobName,
                UserId = userId
            };

            var createdDeck = await _repository.CreateAsync(deck);
            var deckUser = new DeckUser
            {
                ClerkId = userId,
                DeckId = deck.DeckId,
                IsOwner = true,
                AddedAt = DateTime.UtcNow
            };

            await _deckUserRepo.AddAsync(deckUser);

            return deck.ToResponseDto();
        }

        public async Task<DeckResponse?> UpdateDeckAsync(int id, DeckRequest request, string userId)
        {
            var existingDeck = await _repository.GetByIdAsync(id);
            if (existingDeck == null) return null;

            if (existingDeck.UserId != userId) return null;

            // Check if image changed
            var oldImageBlobName = existingDeck.CoverImageBlobName;
            var newImageBlobName = request.CoverImageBlobName;
            bool imageChanged = oldImageBlobName != newImageBlobName;

            // Update deck
            existingDeck.Title = request.Title;
            existingDeck.Description = request.Description;
            existingDeck.Language = request.Language;
            existingDeck.Visibility = request.Visibility;
            existingDeck.CoverImageBlobName = newImageBlobName;
            existingDeck.UpdatedAt = DateTime.UtcNow;

            var result = await _repository.UpdateAsync(existingDeck);

            // Delete old image if changed
            if (imageChanged && !string.IsNullOrEmpty(oldImageBlobName))
            {
                try
                {
                    await _blobService.DeleteFile(new DeleteFileRequest
                    {
                        ContainerName = "deck-images",
                        BlobName = oldImageBlobName
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete old image: {ex.Message}");
                }
            }

            return result.ToResponseDto();
        }

        public async Task<bool> DeleteDeckAsync(int id, string userId)
        {
            var deck = await _repository.GetByIdAsync(id);
            if (deck == null) return false;

            if (deck.UserId != userId) return false;

            var result = await _repository.DeleteAsync(id);

            // Delete image from blob storage if exists
            if (result && !string.IsNullOrEmpty(deck.CoverImageBlobName))
            {
                try
                {
                    await _blobService.DeleteFile(new DeleteFileRequest
                    {
                        ContainerName = "deck-images",
                        BlobName = deck.CoverImageBlobName
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete deck image: {ex.Message}");
                }
            }

            return result;
        }
    }
}