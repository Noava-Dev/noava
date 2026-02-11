using noava.Models;

namespace noava.Services.Cards.BulkReview
{
    public class ShuffleAllStrategy : IBulkReviewStrategy
    {
        private readonly Func<IEnumerable<Card>, List<Card>> _shuffle;

        public ShuffleAllStrategy(Func<IEnumerable<Card>, List<Card>> shuffle)
        {
            _shuffle = shuffle;
        }

        public List<Card> ApplyPerDeck(List<Card> cards) => cards;
        public List<Card> ApplyGlobal(List<Card> cards) => _shuffle(cards);
    }
}