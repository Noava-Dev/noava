namespace noava.Models
{
    public class ClassroomUser
    {
        public int ClassroomId { get; set; }
        public Classroom Classroom { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public bool IsTeacher { get; set; } = false;
    }
}