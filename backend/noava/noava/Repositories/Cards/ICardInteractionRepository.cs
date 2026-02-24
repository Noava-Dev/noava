using noava.DTOs.Cards;
using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardInteractionRepository
    {
        Task<CardInteraction> CreateAsync(CardInteraction interaction);
        Task<List<InteractionCount>> GetInteractionsWholeYearAsync(string clerkId);
        Task<List<InteractionCount>> GetInteractionsWholeYearByDecksAsync(string clerkId, IEnumerable<int> deckIds);

    }
}