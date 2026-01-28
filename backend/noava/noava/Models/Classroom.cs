using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;

namespace noava.Models
{
    public class Classroom
    {
        public int Id { get; set; }

        [Required(ErrorMessage = "Name is required")]
        [StringLength(100, ErrorMessage = "Name can be maximum 100 characters")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Description is required")]
        [StringLength(500, ErrorMessage = "Description can be maximum 500 characters")]
        public string Description { get; set; }
        public string JoinCode { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
        public ICollection<ClassroomUser> ClassroomUsers { get; set; } = new List<ClassroomUser>();
    }
}