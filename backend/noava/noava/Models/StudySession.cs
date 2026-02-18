namespace noava.Models
{
    public class StudySessions
    {
        public int Id { get; set; }
        public string ClerkId { get; set; } = string.Empty;
        public int DeckId { get; set; }
        public DateTime StartTime { get; set; } = DateTime.UtcNow;
        public DateTime EndTime { get; set; } = DateTime.UtcNow;
        public int TotalCards { get; set; }
        public int CorrectCount { get; set; }
    }
}