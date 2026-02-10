using noava.Models;

namespace noava.Services.Cards.BulkReview
{
    public class ShufflePerDeckStrategy : IBulkReviewStrategy
    {
        private readonly Func<IEnumerable<Card>, List<Card>> _shuffle;

        public ShufflePerDeckStrategy(Func<IEnumerable<Card>, List<Card>> shuffle)
        {
            _shuffle = shuffle;
        }

        public List<Card> ApplyPerDeck(List<Card> cards) => _shuffle(cards);
        public List<Card> ApplyGlobal(List<Card> cards) => cards;
    }
}