namespace noava.DTOs.Schools
{
    public class SchoolRequestDto
    {
        public string SchoolName { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public List<string> SchoolAdminEmails { get; set; } = new List<string>();
    }
}
