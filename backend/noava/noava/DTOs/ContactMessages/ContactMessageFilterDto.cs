using noava.Models.Enums;

namespace noava.DTOs.ContactMessages
{
    public class ContactMessageFilterDto
    {
        public ContactSubject? Subject { get; set; }
        public ContactMessageStatus? Status { get; set; }
    }
}