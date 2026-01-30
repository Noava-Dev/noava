using noava.Models.Enums;

namespace noava.Models
{
    public class Deck
    {
        public int DeckId { get; set; }
        public required string Title { get; set; }
        public string? Description { get; set; }
        public required string Language { get; set; }
        public DeckVisibility Visibility { get; set; } = DeckVisibility.Private;
        public string? CoverImageBlobName { get; set; }
        public required string UserId { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public virtual ICollection<DeckUser> DeckUsers { get; set; } = new List<DeckUser>();


    }
}