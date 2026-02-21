using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardProgressRepository
    {
        Task<CardProgress?> GetByCardAndUserAsync(int cardId, string userId);
        Task<CardProgress> CreateAsync(CardProgress progress);
        Task<CardProgress> UpdateAsync(CardProgress progress);
    }
}