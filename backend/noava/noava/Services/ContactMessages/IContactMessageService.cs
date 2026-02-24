using noava.DTOs.ContactMessages;

namespace noava.Services.ContactMessages
{
    public interface IContactMessageService
    {
        Task<IEnumerable<ContactMessageResponse>> GetAllAsync(string userId);
        Task<ContactMessageResponse?> GetByIdAsync(int id, string userId);
        Task<ContactMessageResponse> CreateAsync(ContactMessageRequest dto);
        Task DeleteAsync(int id, string userId);
    }
}