namespace noava.DTOs.StudySessions
{
    public class StudySessionResponse
    {
        public int SessionId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime EndTime { get; set; }
        public int TotalCards { get; set; }
        public int CorrectCount { get; set; }
    }
}