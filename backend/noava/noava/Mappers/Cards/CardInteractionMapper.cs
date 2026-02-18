using noava.DTOs.Cards.Interactions;
using noava.Models;
using noava.Models.Enums;

namespace noava.Mappers.Cards
{
    public static class CardInteractionMapper
    {
        public static CardInteractionResponse ToResponse(CardInteraction cardInteraction)
        {
            return new CardInteractionResponse
            {
                InteractionId = cardInteraction.Id,
                CardId = cardInteraction.CardId,
                UserId = cardInteraction.ClerkId,
                SessionId = cardInteraction.StudySessionId,
                IsCorrect = cardInteraction.IsCorrect,
                ReviewedAt = cardInteraction.Timestamp,
                StudyMode = cardInteraction.StudyMode,
                IntervalBefore = cardInteraction.IntervalBefore,
                IntervalAfter = cardInteraction.IntervalAfter,
                DueAtBefore = cardInteraction.DueAtBefore,
                DueAtAfter = cardInteraction.DueAtAfter
            };
        }

        public static CardInteraction ToEntity(int studySessionId, int deckId, int cardId, string userId, CardInteractionRequest cardInteraction, CardInteractionIntervalRequest intervalRequest)
        {
            return new CardInteraction
            {
                CardId = cardId,
                DeckId = deckId,
                StudySessionId = studySessionId,
                ClerkId = userId,
                IsCorrect = cardInteraction.IsCorrect,
                Timestamp = DateTime.UtcNow,
                ResponseTimeMs = cardInteraction.ResponseTimeMs,
                StudyMode = cardInteraction.StudyMode,
                IntervalBefore = intervalRequest.IntervalBefore,
                IntervalAfter = intervalRequest.IntervalAfter,
                DueAtBefore = intervalRequest.DueAtBefore,
                DueAtAfter = intervalRequest.DueAtAfter
            };
        }
    }
}