namespace noava.Models
{
    public class School
    {
        public int SchoolId { get; set; }
        public string Name { get; set;}
        public int OwnerId { get; set; }
        public int CreatedBy { get; set; }

        public DateTime CreatedAt = DateTime.Now;
        public DateTime UpdatedAt { get; set; }
    }
   
}