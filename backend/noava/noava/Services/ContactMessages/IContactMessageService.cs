using noava.DTOs.ContactMessages;
using noava.Models.Enums;

namespace noava.Services.ContactMessages
{
    public interface IContactMessageService
    {
        Task<IEnumerable<ContactMessageResponse>> GetAllAsync(string userId, ContactMessageFilterDto filter);
        Task<ContactMessageResponse?> GetByIdAsync(int id, string userId);
        Task<ContactMessageResponse> CreateAsync(ContactMessageRequest dto);
        Task<ContactMessageResponse> UpdateStatusAsync(int id, string userId, ContactMessageStatus status);
        Task DeleteAsync(int id, string userId);
    }
}