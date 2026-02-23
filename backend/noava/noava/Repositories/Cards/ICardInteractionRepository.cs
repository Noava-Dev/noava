using noava.DTOs.Cards;
using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardInteractionRepository
    {
        Task<CardInteraction> CreateAsync(CardInteraction interaction);
        Task<List<InteractionCount>> GetInteractionsThisAndLastYearAsync(string clerkId);
    }
}