namespace noava.DTOs.Schools
{
    public class SchoolDetailsDto
    {

        public int Id { get; set; }
        public string SchoolName { get; set; } = null!;
        public List<UserSummaryDto> Admins { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}
