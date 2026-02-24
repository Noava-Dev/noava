using noava.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace noava.Models
{
    public class ContactMessage
    {
        public int Id { get; set; }

        [Required]
        public ContactTitle Title { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string SenderEmail { get; set; } = null!;

        [Required]
        public ContactSubject Subject { get; set; }

        [Required]
        [MaxLength(4000)]
        public string Description { get; set; } = null!;

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}