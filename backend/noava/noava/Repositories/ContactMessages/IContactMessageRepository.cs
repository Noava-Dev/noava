using noava.DTOs.ContactMessages;
using noava.Models;

namespace noava.Repositories.ContactMessages
{
    public interface IContactMessageRepository
    {
        Task<ContactMessage?> GetByIdAsync(int id);
        Task<IEnumerable<ContactMessage>> GetAllAsync(ContactMessageFilterDto filter);
        Task AddAsync(ContactMessage message);
        Task UpdateAsync(ContactMessage entity);
        Task DeleteAsync(ContactMessage message);
    }
}