using System.ComponentModel.DataAnnotations;

namespace noava.DTOs.Request
{
    public class InviteUserRequest
    {
        [Required]
        public string ClerkId { get; set; } = string.Empty;
    }
}