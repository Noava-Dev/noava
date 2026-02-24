using noava.Models.Enums;

namespace noava.DTOs.Cards.Interactions
{
    public class CardInteractionResponse
    {
        public int InteractionId { get; set; }
        public int CardId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int? SessionId { get; set; }
        public bool IsCorrect { get; set; }
        public DateTime ReviewedAt { get; set; }
        public StudyMode StudyMode { get; set; }
        public int IntervalBefore { get; set; } // in days
        public int IntervalAfter { get; set; } // in days
        public DateTime DueAtBefore { get; set; }
        public DateTime DueAtAfter { get; set; }
    }
}