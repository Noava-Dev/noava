namespace noava.DTOs.Classrooms
{
    public class ClassroomUserResponseDto
    {
        public string ClerkId { get; set; } = string.Empty;
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public bool IsTeacher { get; set; }
    }
}