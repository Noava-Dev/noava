using noava.Models;
using noava.Repositories;

namespace noava.Services
{
    public class DeckService
    {
        private readonly DeckRepository _repository;

        public DeckService(DeckRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<Deck>> GetAllDecksAsync()
        {
            return await _repository.GetAllAsync();
        }

        public async Task<Deck?> GetDeckByIdAsync(int id)
        {
            return await _repository.GetByIdAsync(id);
        }
        public async Task<Deck> CreateDeckAsync(Deck deck)
        {
            return await _repository.CreateAsync(deck);
        }
        public async Task<Deck?> UpdateDeckAsync(int id, Deck updatedDeck)
        {
            var existingDeck = await _repository.GetByIdAsync(id);
            if (existingDeck == null) return null;

            existingDeck.Title = updatedDeck.Title;
            existingDeck.Description = updatedDeck.Description;
            existingDeck.Language = updatedDeck.Language;
            existingDeck.Visibility = updatedDeck.Visibility;

            existingDeck.UpdatedAt = DateTime.UtcNow; // PR comment

            return await _repository.UpdateAsync(existingDeck);
        }

        public async Task<bool> DeleteDeckAsync(int id)
        {
            return await _repository.DeleteAsync(id);
        }
    }
}