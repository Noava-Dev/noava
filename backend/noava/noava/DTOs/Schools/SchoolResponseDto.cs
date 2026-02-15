using noava.DTOs.Clerk;

namespace noava.DTOs.Schools
{
    public class SchoolResponseDto
    {

        public int Id { get; set; }
        public string SchoolName { get; set; } = string.Empty;

        public ClerkUserResponseDto? CreatedBy { get; set; }
        public List<ClerkUserResponseDto> Admins { get; set; } = new();
        public DateTime CreatedAt { get; set; }
        public DateTime UpdatedAt { get; set; }

        public int TotalStudents { get; set; }
        public int TotalDecks { get; set; }
    }
}
