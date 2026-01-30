using noava.DTOs.Request.Notifications;
using noava.DTOs.Response.Notifications;
using noava.Models;

namespace noava.Services.Contracts
{
    public interface INotificationService
    {
        Task<List<NotificationResponseDto>> GetNotificationsForUserAsync(string userId);
        Task<NotificationResponseDto> CreateNotificationAsync(NotificationRequestDto notification);
        Task DeleteNotificationAsync(long notificationId, string userId);
        Task<NotificationResponseDto?> GetNotificationByIdAsync(long id, string userId);
    }
}