namespace noava.Models
{
    public class ClassroomDeck
    {
        public int ClassroomId { get; set; }
        public Classroom? Classroom { get; set; }

        public int DeckId { get; set; }
        public Deck? Deck { get; set; }

        public DateTime AddedAt { get; set; } = DateTime.UtcNow;
    }
}