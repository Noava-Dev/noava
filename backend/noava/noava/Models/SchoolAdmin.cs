namespace noava.Models
{
    public class SchoolAdmin
    {
        public int SchoolId { get; set; }
        public School School { get; set; }

        public string UserId { get; set; } = null!;
        public User User { get; set; }
    }
}
