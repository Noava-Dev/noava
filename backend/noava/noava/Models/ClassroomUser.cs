namespace noava.Models
{
    public class ClassroomUser
    {
        public int ClassroomId { get; set; }
        public Classroom? Classroom { get; set; }
        public string UserId { get; set; } = string.Empty;
        public User? User { get; set; }
        public bool IsTeacher { get; set; } = false;
    }
}