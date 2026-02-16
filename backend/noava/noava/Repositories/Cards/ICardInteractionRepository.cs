using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardInteractionRepository
    {
        Task<CardInteractions?> GetByIdAsync(int interactionId);
        Task<List<CardInteractions>> GetByCardIdAsync(int cardId);
        Task<List<CardInteractions>> GetByUserIdAsync(string userId);
        Task<List<CardInteractions>> GetBySessionIdAsync(int sessionId);
        Task<CardInteractions?> GetLatestInteractionAsync(int cardId, string userId);
        Task<CardInteractions> CreateAsync(CardInteractions interaction);
        Task<CardInteractions> UpdateAsync(CardInteractions interaction);
        Task<bool> DeleteAsync(int interactionId);
    }
}