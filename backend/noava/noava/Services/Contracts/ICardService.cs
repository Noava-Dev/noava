using noava.DTOs.Request;
using noava.DTOs.Response;

namespace noava.Services.Interfaces
{
    public interface ICardService
    {
        Task<List<CardResponse>> GetCardsByDeckIdAsync(int deckId, string userId);
        Task<CardResponse?> GetCardByIdAsync(int id, string userId);
        Task<CardResponse> CreateCardAsync(int deckId, CardRequest request, string userId);
        Task<CardResponse?> UpdateCardAsync(int id, CardRequest request, string userId);
        Task<bool> DeleteCardAsync(int id, string userId);
    }
}