using noava.DTOs.Notifications;
using noava.Models;

namespace noava.Services.Contracts
{
    public interface INotificationService
    {
        Task<List<NotificationDto>> GetNotificationsForUserAsync(string userId);
        Task<NotificationDto> CreateNotificationAsync(NotificationDto notification);
        Task DeleteNotificationAsync(long notificationId, string userId);
        Task<NotificationDto?> GetNotificationByIdAsync(long id, string userId);
    }
}
