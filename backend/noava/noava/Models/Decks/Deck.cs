namespace noava.Models
{
    public enum DeckVisibility
    {
        Public = 0,
        Shared = 1,
        Private = 2
    }

    public class Deck
    {
        public int DeckId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public string? Language { get; set; }
        public DeckVisibility Visibility { get; set; } = DeckVisibility.Private;
        // public string? CoverImageUrl { get; set; } // Bucket first?
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

       
    }
}