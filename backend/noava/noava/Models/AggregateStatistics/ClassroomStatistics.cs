namespace noava.Models.AggregateStatistics
{
    public class ClassroomStatistics
    {
        public int ClassroomId { get; set; }
        public Classroom? Classroom { get; set; }


        public ICollection<User> ActiveUsers { get; set; } = new List<User>();
        public int CardsReviewed { get; set; }
        public int CorrectCards { get; set; }
        public int TimeSpentSeconds { get; set; }
        public double AvgMasteryLevel { get; set; }
    }
}
