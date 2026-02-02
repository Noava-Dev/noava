using noava.DTOs.Decks;

namespace noava.Services.Decks
{
    public interface IDeckService
    {
        Task<List<DeckResponse>> GetAllDecksAsync();
        Task<List<DeckResponse>> GetUserDecksAsync(string userId, int? limit);
        Task<DeckResponse?> GetDeckByIdAsync(int id);
        Task<DeckResponse> CreateDeckAsync(DeckRequest request, string userId);
        Task<DeckResponse?> UpdateDeckAsync(int id, DeckRequest request, string userId);
        Task<bool> DeleteDeckAsync(int id, string userId);
    }
}