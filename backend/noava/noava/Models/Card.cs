namespace noava.Models
{
    public class Card
    {
        public int Id { get; set; }
        public int DeckId { get; set; }
        public string FrontText { get; set; }
        public string BackText { get; set; }
        public string? FrontImage { get; set; }
        public string? BackImage { get; set; }
        public string? FrontAudio { get; set; }
        public string? BackAudio { get; set; }
        public string? Memo { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public bool HasVoiceAssistant { get; set; }
    }
}
