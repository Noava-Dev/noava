namespace noava.Models
{
    public class UserDeck
    {
        public string UserId { get; set; } = string.Empty;
        public int DeckId { get; set; } // FK
        public bool IsCreator { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        
        public Deck Deck { get; set; } = null!;
    }
}