namespace noava.DTOs.Cards.Progress
{
    public class CardProgressResponse
    {
        public int Id { get; set; }
        public int CardId { get; set; }
        public DateOnly NextReviewDate { get; set; }
        public int BoxNumber { get; set; }
        public DateTime LastReviewedAt { get; set; }
        public int CorrectCount { get; set; }
        public int IncorrectCount { get; set; }
        public int Streak { get; set; }
    }
}