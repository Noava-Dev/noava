using noava.Models;
using noava.Models.BlobStorage;
using noava.Repositories.Contracts;
using noava.Services.Contracts;
using noava.Shared;

namespace noava.Services
{
    public class DeckService : IDeckService
    {
        private readonly IDeckRepository _repository;
        private readonly IBlobService _blobService;
        public DeckService(IDeckRepository repository, IBlobService blobService)
        {
            _repository = repository ?? throw new ArgumentNullException(nameof(repository));
            _blobService = blobService ?? throw new ArgumentNullException(nameof(blobService));
        }

        public DeckService(IDeckRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Deck>> GetAllDecksAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<List<Deck>> GetUserDecksAsync(string userId)
        {
            return await _repository.GetByUserIdAsync(userId);
        }

        public async Task<Deck?> GetDeckByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }

        public async Task<Deck> CreateDeckAsync(Deck deck)
        {
            return await _repository.CreateAsync(deck);
        }

        public async Task<Deck?> UpdateDeckAsync(int id, Deck updatedDeck, string userId)
        {
            var existingDeck = await _repository.GetByIdAsync(id);
            if (existingDeck == null) return null;

            if (existingDeck.UserId != userId) return null;

            var oldImageBlobName = existingDeck.CoverImageBlobName;
            var newImageBlobName = updatedDeck.CoverImageBlobName;
            bool imageChanged = oldImageBlobName != newImageBlobName;

            existingDeck.Title = updatedDeck.Title;
            existingDeck.Description = updatedDeck.Description;
            existingDeck.Language = updatedDeck.Language;
            existingDeck.Visibility = updatedDeck.Visibility;
            existingDeck.CoverImageBlobName = newImageBlobName; // ← BlobName
            existingDeck.UpdatedAt = DateTime.UtcNow;

            // Delete old image if changed and old image exists
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
                    // Log error but don't fail the update
                    Console.WriteLine($"Failed to delete old image: {ex.Message}");
                }
            }

            return await _repository.UpdateAsync(existingDeck);
        }

        public async Task<bool> DeleteDeckAsync(int id, string userId)
        {
            var deck = await _repository.GetByIdAsync(id);
            if (deck == null) return false;
            if (deck.UserId != userId) return false;

            var result = await _repository.DeleteAsync(id);

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