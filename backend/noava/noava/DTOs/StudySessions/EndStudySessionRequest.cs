using System.ComponentModel.DataAnnotations;

namespace noava.DTOs.StudySessions
{
    public class EndStudySessionRequest
    {
        [Range(0, int.MaxValue, ErrorMessage = "TotalCardsReviewed should be positive")]
        public int TotalCardsReviewed { get; set; }

        [Range(0, int.MaxValue, ErrorMessage = "CorrectAnswers should be positive")]
        public int CorrectAnswers { get; set; }
    }
}