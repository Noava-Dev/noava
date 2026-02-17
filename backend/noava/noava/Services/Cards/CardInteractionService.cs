using noava.DTOs.Cards.Interactions;
using noava.DTOs.Cards.Progress;
using noava.Mappers.Cards;
using noava.Models;
using noava.Repositories.Cards;

namespace noava.Services.Cards
{
    public class CardInteractionService : ICardInteractionService
    {
        private readonly ICardInteractionRepository _interactionRepo;
        private readonly ICardProgressRepository _progressRepo;
        private readonly ILeitnerBoxService _leitner;

        public CardInteractionService(
            ICardInteractionRepository interactionRepo,
            ICardProgressRepository progressRepo,
            ILeitnerBoxService leitner)
        {
            _interactionRepo = interactionRepo;
            _progressRepo = progressRepo;
            _leitner = leitner;
        }

        public async Task<CardProgressResponse> CreateCardInteractionAsync(
            int studySessionId,
            int deckId,
            int cardId,
            string userId,
            CardInteractionRequest request)
        {
            var progress = await _progressRepo.GetByCardAndUserAsync(cardId, userId);

            if (progress == null)
            {
                progress = new CardProgress
                {
                    CardId = cardId,
                    ClerkId = userId,
                    NextReviewDate = DateOnly.FromDateTime(DateTime.UtcNow),
                    BoxNumber = 1,
                    LastReviewedAt = DateTime.UtcNow
                };

                progress = await _progressRepo.CreateAsync(progress);
            }

            var timeOfDay = TimeOnly.MinValue;

            int intervalBefore = _leitner.GetIntervalForBox(progress.BoxNumber);
            DateTime dueBefore = progress.NextReviewDate.ToDateTime(timeOfDay, DateTimeKind.Utc);

            _leitner.UpdateCardProgress(progress, request.IsCorrect);

            int intervalAfter = _leitner.GetIntervalForBox(progress.BoxNumber);
            DateTime dueAfter = progress.NextReviewDate.ToDateTime(timeOfDay, DateTimeKind.Utc);

            progress = await _progressRepo.UpdateAsync(progress);

            var intervalRequest = new CardInteractionIntervalRequest
            {
                IntervalBefore = intervalBefore,
                IntervalAfter = intervalAfter,
                DueAtBefore = dueBefore,
                DueAtAfter = dueAfter
            };

            var x = request.ResponseTimeMs; // breakpoint hier


            var interactionEntity = CardInteractionMapper.ToEntity(
                studySessionId,
                deckId,
                cardId,
                userId,
                request,
                intervalRequest
            );

            await _interactionRepo.CreateAsync(interactionEntity);

            return new CardProgressResponse
            {
                Id = progress.Id,
                CardId = progress.CardId,
                NextReviewDate = progress.NextReviewDate,
                BoxNumber = progress.BoxNumber,
                LastReviewedAt = progress.LastReviewedAt,
                CorrectCount = progress.CorrectCount,
                IncorrectCount = progress.IncorrectCount,
                Streak = progress.Streak
            };
        }
    }
}