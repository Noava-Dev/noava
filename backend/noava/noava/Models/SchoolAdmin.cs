namespace noava.Models
{
    public class SchoolAdmin
    {
        public int SchoolId { get; set; }
        public School? School { get; set; }
        public string ClerkId { get; set; } = string.Empty;
        public User? User { get; set; }
    }
}
