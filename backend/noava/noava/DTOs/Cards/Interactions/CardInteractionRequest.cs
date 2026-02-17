using noava.Models.Enums;

namespace noava.DTOs.Cards.Interactions
{
    public class CardInteractionRequest
    {
        public DateTime Timestamp { get; set; } = DateTime.UtcNow;
        public bool IsCorrect { get; set; }
        public int ResponseTimeMs { get; set; }
        public StudyMode StudyMode { get; set; }
    }
}