using noava.DTOs.Cards;

namespace noava.Services.Cards
{
    public interface ICardImportService
    {
        Task<int> ImportCardsAsync(int deckId, IFormFile file, string userId);
    }
}