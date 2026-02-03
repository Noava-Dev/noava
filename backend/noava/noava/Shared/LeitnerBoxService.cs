using noava.Models;

namespace noava.Services
{
    public class LeitnerBoxService : ILeitnerBoxService
    {
        private readonly Dictionary<int, int> _boxIntervals = new()
        {
            { 1, 1 },
            { 2, 3 },
            { 3, 7 },
            { 4, 14 },
            { 5, 30 }
        };

        private readonly int _maxBoxes = 5;

        // get interval corresponding to box number
        public int GetIntervalForBox(int boxNumber)
        {
            return _boxIntervals.TryGetValue(boxNumber, out var days) ? days : 1;
        }

        // determine next box based on current box and correctness
        public int GetNextBox(int currentBox, bool isCorrect)
        {
            if (isCorrect) return Math.Min(currentBox + 1, _maxBoxes);

            return 1;
        }

        // update card progress based on review outcome
        public void UpdateCardProgress(CardProgress card, bool isCorrect)
        {
            int oldBox = card.BoxNumber;
            card.BoxNumber = GetNextBox(card.BoxNumber, isCorrect);
            card.NextReviewDate = DateOnly.FromDateTime(DateTime.UtcNow)
                .AddDays(GetIntervalForBox(card.BoxNumber));
            card.LastReviewedAt = DateTime.UtcNow;

            if (isCorrect)
            {
                card.CorrectCount++;
                card.Streak++;
            }
            else
            {
                card.IncorrectCount++;
                card.Streak = 0;
            }
        }

    }
}
