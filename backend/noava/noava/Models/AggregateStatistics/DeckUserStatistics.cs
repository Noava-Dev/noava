namespace noava.Models.AggregateStatistics
{
    public class DeckUserStatistics
    {
        public int DeckId { get; set; }
        public Deck? Deck { get; set; }

        public string ClerkId { get; set; }
        public User? User { get; set; }

        public int CardsReviewed { get; set; }
        public int CorrectCards { get; set; }
        public double AccuracyRate { get; set; }
        public int TimeSpentSeconds { get; set; }
        public int AvgResponseTimeMs { get; set; }
        public DateTime LastReviewedAt { get; set; }
        public double AvgMasteryLevel { get; set; }
    }
}
