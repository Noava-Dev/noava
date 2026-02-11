using noava.Models;

namespace noava.Services.Cards.BulkReview
{
    public class BulkReviewStrategy : IBulkReviewStrategy
    {
        public List<Card> ApplyPerDeck(List<Card> cards) => cards;
        public List<Card> ApplyGlobal(List<Card> cards) => cards;
    }
}