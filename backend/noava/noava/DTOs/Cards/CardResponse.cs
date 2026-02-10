namespace noava.DTOs.Cards
{
    public class CardResponse
    {
        public int CardId { get; set; }
        public int DeckId { get; set; }
        public string FrontText { get; set; } = string.Empty;
        public string BackText { get; set; } = string.Empty;
        public string? FrontImage { get; set; }
        public string? FrontAudio { get; set; }
        public string? BackImage { get; set; }
        public string? BackAudio { get; set; }
        public string? Memo { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
        public bool HasVoiceAssistant { get; set; }
    }
}