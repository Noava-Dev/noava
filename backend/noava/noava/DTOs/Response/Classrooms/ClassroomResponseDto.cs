using System.ComponentModel.DataAnnotations;

namespace noava.DTOs.Response.Classrooms
{
    public class ClassroomResponseDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string JoinCode { get; set; } = string.Empty;
        public ClassroomPermissionsDto Permissions { get; set; } = new();
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}