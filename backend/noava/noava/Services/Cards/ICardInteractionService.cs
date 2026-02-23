using noava.DTOs.Cards;
using noava.DTOs.Cards.Interactions;
using noava.DTOs.Cards.Progress;

namespace noava.Services.Cards
{
    public interface ICardInteractionService
    {
        Task<CardProgressResponse> CreateCardInteractionAsync(int studySessionId, int deckId, int cardId, string userId,CardInteractionRequest request);
        Task<List<InteractionCount>> GetInteractionStatsAsync(string clerkId);
    }
}