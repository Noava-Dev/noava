namespace noava.DTOs.Statistics
{
    public class DashboardStatisticsResponse
    {
        public int CardsReviewed { get; set; }
        public double AccuracyRate { get; set; }
        public double TimeSpentHours { get; set; }
        public DateTime? LastRevieweDate { get; set; }
    }
}