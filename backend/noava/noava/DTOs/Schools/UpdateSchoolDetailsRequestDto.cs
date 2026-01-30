namespace noava.DTOs.Schools
{
    public class UpdateSchoolDetailsRequestDto
    {
        public string SchoolName { get; set; } = null!;
        public List<string> SchoolAdminEmails { get; set; } = [];
    }
}
