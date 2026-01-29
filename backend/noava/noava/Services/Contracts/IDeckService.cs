using noava.DTOs.Request;
using noava.DTOs.Response;

namespace noava.Services.Interfaces
{
    public interface IDeckService
    {
        Task<List<DeckResponse>> GetAllDecksAsync();
        Task<List<DeckResponse>> GetUserDecksAsync(string userId);
        Task<DeckResponse?> GetDeckByIdAsync(int id);
        Task<DeckResponse> CreateDeckAsync(DeckRequest request, string userId);
        Task<DeckResponse?> UpdateDeckAsync(int id, DeckRequest request, string userId);
        Task<bool> DeleteDeckAsync(int id, string userId);
    }
}