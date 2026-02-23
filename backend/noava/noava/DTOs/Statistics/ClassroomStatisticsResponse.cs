using noava.Models;

namespace noava.DTOs.Statistics
{
    public class ClassroomStatisticsResponse
    {
        public int ClassroomId { get; set; }
        public int ActiveUsersCount { get; set; }
        public int CardsReviewed { get; set; }
        public int CorrectCards { get; set; }
        public int TimeSpentSeconds { get; set; }
        public double AvgMasteryLevel { get; set; }
    }
}
