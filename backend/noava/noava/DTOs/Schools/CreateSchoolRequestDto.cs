namespace noava.DTOs.Schools
{
    public class CreateSchoolRequestDto
    {
        public string Name { get; set; } = null!;
        public List<string> AdminUserIds { get; set; } = new();
        public string CreatedByUserId { get; set; } = null!;
    }
}
