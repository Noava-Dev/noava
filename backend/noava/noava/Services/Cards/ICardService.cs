using noava.DTOs.Cards;
using noava.Models.Enums;

namespace noava.Services.Cards
{
    public interface ICardService
    {
        Task<List<CardResponse>> GetCardsByDeckIdAsync(int deckId, string userId);
        Task<CardResponse?> GetCardByIdAsync(int id, string userId);
        Task<List<CardResponse>> GetAllCardsLongtermAsync(int deckId, string userId, ReviewMode mode);
        Task<CardResponse> CreateCardAsync(int deckId, CardRequest request, string userId);
        Task<CardResponse?> UpdateCardAsync(int id, CardRequest request, string userId);
        Task<bool> DeleteCardAsync(int id, string userId);
        Task<List<CardResponse>> GetBulkReviewCardsAsync(List<int> deckIds, string userId, ReviewMode mode);
    }
}