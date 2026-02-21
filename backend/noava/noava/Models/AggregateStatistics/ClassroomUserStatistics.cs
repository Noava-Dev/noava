namespace noava.Models.AggregateStatistics
{
    public class ClassroomUserStatistics
    {
        public int ClassroomId { get; set; }
        public Classroom? Classroom { get; set; }

        public string ClerkId { get; set; }
        public User? User { get; set; }

        public int CardsReviewed { get; set; }
        public int CorrectCards { get; set; }
        public double AccuracyRate { get; set; }
        public int TimeSpentSeconds { get; set; }
        public DateTime LastReviewedAt { get; set; }
        public double AvgMasteryLevel { get; set; }
    }
}
