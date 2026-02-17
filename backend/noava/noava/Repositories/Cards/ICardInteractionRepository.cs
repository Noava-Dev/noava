using noava.Models;

namespace noava.Repositories.Cards
{
    public interface ICardInteractionRepository
    {
        Task<CardInteractions> CreateAsync(CardInteractions interaction);
    }
}