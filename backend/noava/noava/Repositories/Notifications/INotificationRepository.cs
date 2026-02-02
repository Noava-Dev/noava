using noava.Models;

namespace noava.Repositories.Notifications
{
    public interface INotificationRepository
    {
        Task<List<Notification>> GetByUserIdAsync(string userId);
        Task<Notification?> GetByIdAsync(long id);
        Task AddAsync(Notification notification);
        void Delete(Notification notification);
        Task SaveChangesAsync();
    }
}