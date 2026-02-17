namespace noava.Models.AggregateStatistics
{
    public class ClassroomDeckStatistics
    {
        public int ClassroomId { get; set; }
        public Classroom? Classroom { get; set; }

        public int DeckId { get; set; }
        public Deck? Deck { get; set; }

        public int CardsReviewed { get; set; }
        public int CorrectCards { get; set; }
        public double AccuracyRate { get; set; }
        public int AvgResponseTimeMs { get; set; }
        public int AvgTimeSpentSeconds { get; set; }
        public DateTime LastReviewedAt { get; set; }
        public double AvgMasteryLevel { get; set; }
    }
}
