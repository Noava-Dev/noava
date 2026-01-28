using noava.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace noava.Models
{
    public class User
    {
        [Key]
        public string ClerkId { get; set; } = string.Empty;

        [Required]
        public UserRole Role { get; set; } = UserRole.USER;
        public ICollection<ClassroomUser> ClassroomUsers { get; set; } = new List<ClassroomUser>();

    }
}