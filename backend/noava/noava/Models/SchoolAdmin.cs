namespace noava.Models
{
    public class SchoolAdmin
    {
        public int SchoolId { get; set; }
        public required School School { get; set; }

        public int UserId { get; set; }
        public required User User { get; set; }
    }
}
