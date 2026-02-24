using noava.Models;

namespace noava.Repositories.ContactMessages
{
    public interface IContactMessageRepository
    {
        Task<ContactMessage?> GetByIdAsync(int id);
        Task<IEnumerable<ContactMessage>> GetAllAsync();
        Task AddAsync(ContactMessage message);
        Task DeleteAsync(ContactMessage message);
    }
}