using noava.Models.Enums;

namespace noava.Models
{
    public class CardInteractions
    {
        public int Id { get; set; }
        public int CardId { get; set; }
        public string ClerkId { get; set; }
        public int StudySessionId { get; set; }
        public int DeckId { get; set; }
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsCorrect { get; set; }
        public int ResponseTimeMs { get; set; }
        public StudyMode StudyMode { get; set; }
        public InteractionType InteractionType { get; set; }
        public int IntervalBefore { get; set; } // in days
        public int IntervalAfter { get; set; } // in days
        public DateTime DueAtBefore { get; set; }
        public DateTime DueAtAfter { get; set; }
    }
}
