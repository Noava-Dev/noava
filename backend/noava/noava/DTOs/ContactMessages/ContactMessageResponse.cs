using noava.Models.Enums;

namespace noava.DTOs.ContactMessages
{
    public class ContactMessageResponse
    {
        public int Id { get; set; }

        public ContactTitle Title { get; set; }

        public string SenderEmail { get; set; } = null!;

        public ContactSubject Subject { get; set; }

        public string Description { get; set; } = string.Empty;

        public DateTime CreatedAt { get; set; }
    }
}