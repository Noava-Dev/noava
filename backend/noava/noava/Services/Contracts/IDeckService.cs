using noava.Models;

namespace noava.Services.Contracts
{
    public interface IDeckService
    {
        Task<List<Deck>> GetAllDecksAsync();
        Task<List<Deck>> GetUserDecksAsync(string userId);
        Task<Deck?> GetDeckByIdAsync(int id);
        Task<Deck> CreateDeckAsync(Deck deck);
        Task<Deck?> UpdateDeckAsync(int id, Deck updatedDeck, string userId);
        Task<bool> DeleteDeckAsync(int id, string userId);
    }
}