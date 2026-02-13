using noava.Models.Enums;

namespace noava.Models
{
    public class Deck
    {
        public int DeckId { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Language { get; set; } = string.Empty;
        public DeckVisibility Visibility { get; set; } = DeckVisibility.Private;
        public string? CoverImageBlobName { get; set; }
        public string UserId { get; set; } = string.Empty;
        public string JoinCode { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<DeckUser> DeckUsers { get; set; } = new List<DeckUser>();
        public ICollection<ClassroomDeck> ClassroomDecks { get; set; } = new List<ClassroomDeck>();
    }
}