namespace noava.DTOs.CardInteractions
{
    public class CardInteractionResponse
    {
        public int InteractionId { get; set; }
        public int CardId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public int? SessionId { get; set; }
        public bool IsCorrect { get; set; }
        public DateTime ReviewedAt { get; set; }
        public int Box { get; set; }
        public DateTime? NextReviewDate { get; set; }
    }
}