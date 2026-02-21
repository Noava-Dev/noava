namespace noava.Models
{
    public class CardProgress
    {
        public int Id { get; set; }
        public int CardId { get; set; }
        public string ClerkId { get; set; } = string.Empty;
        public DateOnly NextReviewDate { get; set; }
        public int BoxNumber { get; set; } = 1;
        public DateTime LastReviewedAt { get; set; } = DateTime.UtcNow;
        public int CorrectCount { get; set; } = 0;
        public int IncorrectCount { get; set; } = 0;
        public int Streak { get; set; } = 0;
    }
}
