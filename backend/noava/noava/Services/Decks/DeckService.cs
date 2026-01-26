using noava.Models;
using noava.Repositories.Contracts;
using noava.Services.Contracts;

namespace noava.Services
{
    public class DeckService : IDeckService
    {
        private readonly IDeckRepository _repository;

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

            existingDeck.Title = updatedDeck.Title;
            existingDeck.Description = updatedDeck.Description;
            existingDeck.Language = updatedDeck.Language;
            existingDeck.Visibility = updatedDeck.Visibility;
            existingDeck.CoverImageBlobName = updatedDeck.CoverImageBlobName;  // ← BlobName
            existingDeck.UpdatedAt = DateTime.UtcNow;

            return await _repository.UpdateAsync(existingDeck);
        }

        public async Task<bool> DeleteDeckAsync(int id, string userId)
        {
            var deck = await _repository.GetByIdAsync(id);
            if (deck == null) return false;

            if (deck.UserId != userId) return false;

            return await _repository.DeleteAsync(id);
        }
    }
}