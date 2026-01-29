namespace noava.DTOs.Schools
{
    public class SchoolResponseDto
    {
        //mainly for GETs

        public int Id { get; set; }
        public string SchoolName { get; set; } = null!;
        public List<string> AdminUserIds { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
