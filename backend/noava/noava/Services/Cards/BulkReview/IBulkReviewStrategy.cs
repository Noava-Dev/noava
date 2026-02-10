using noava.Models;

namespace noava.Services.Cards.BulkReview
{
    public interface IBulkReviewStrategy
    {
        List<Card> ApplyPerDeck(List<Card> cards);
        List<Card> ApplyGlobal(List<Card> cards);
    }
}