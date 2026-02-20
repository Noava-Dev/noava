using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardInteractionRepository
    {
        Task<CardInteraction> CreateAsync(CardInteraction interaction);
    }
}