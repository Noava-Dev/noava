namespace noava.Models
{
    public class School
    {
        public int Id { get; set; }
        public required string Name { get; set; } = null!;

        public User CreatedBy { get; set; } = null!;
        //UserId is easier for querying quickly instead of loading the entire user
        public required int CreatedByUserId { get; set; }

        public ICollection<SchoolAdmin> SchoolAdmins { get; set; } = null!;


        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }

}