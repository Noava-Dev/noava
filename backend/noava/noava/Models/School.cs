namespace noava.Models
{
    public class School
    {
        public int Id { get; set; }
        public required string Name { get; set; } = string.Empty;
        public required string CreatedBy { get; set; } = string.Empty;
        public User? CreatedByUser { get; set; }
        public ICollection<SchoolAdmin> SchoolAdmins { get; set; } = new List<SchoolAdmin>();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

        //CLASSROOMS
        public ICollection<Classroom>? Classrooms { get; set; } = new List<Classroom>();
    }

}