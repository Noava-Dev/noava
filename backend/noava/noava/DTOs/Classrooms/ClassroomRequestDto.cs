using System.ComponentModel.DataAnnotations;

namespace noava.DTOs.Classrooms
{
    public class ClassroomRequestDto
    {
        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can be maximum 100 characters")]
        public string Name { get; set; } = string.Empty;

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, ErrorMessage = "Description can be maximum 500 characters")]
        public string Description { get; set; } = string.Empty;
        public string? CoverImageBlobName { get; set; }
        public int? SchoolId { get; set; }
    }
}