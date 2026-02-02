using noava.DTOs.Notifications;
using noava.Models;

namespace noava.Services.Notifications
{
    public interface INotificationService
    {
        Task<List<NotificationResponseDto>> GetNotificationsForUserAsync(string userId);
        Task<NotificationResponseDto> CreateNotificationAsync(NotificationRequestDto notification);
        Task DeleteNotificationAsync(long notificationId, string userId);
        Task<NotificationResponseDto?> GetNotificationByIdAsync(long id, string userId);
    }
}