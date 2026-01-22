using noava.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace noava.Models
{
    public class User
    {
        [Key]
        public string ClerkId { get; set; } = String.Empty;

        [Required]
        public UserRole Role { get; set; } = UserRole.USER;
    }
}