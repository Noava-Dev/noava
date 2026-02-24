using noava.Models.Enums;
using System.ComponentModel.DataAnnotations;

namespace noava.DTOs.ContactMessages
{
    public class ContactMessageRequest
    {
        [Required]
        public ContactTitle Title { get; set; }

        [Required]
        [EmailAddress]
        [MaxLength(255)]
        public string SenderEmail { get; set; } = null!;

        [Required]
        public ContactSubject Subject { get; set; }

        [Required]
        [MinLength(20)]
        [MaxLength(4000)]
        public string Description { get; set; } = null!;
    }
}