namespace noava.DTOs.Response.Users
{
    public class ClerkUserResponseDto
    {
        public string ClerkId { get; init; } = string.Empty;
        public string FirstName { get; init; } = string.Empty;
        public string LastName { get; init; } = string.Empty;
        public string Email { get; init; } = string.Empty;
        public bool IsTeacher { get; set; }
    }
}