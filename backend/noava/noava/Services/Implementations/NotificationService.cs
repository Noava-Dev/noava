using noava.DTOs.Notifications;
using noava.Mappers.Notifications;
using noava.Models;
using noava.Repositories.Contracts;
using noava.Services.Contracts;

namespace noava.Services.Implementations
{
    public class NotificationService : INotificationService
    {

        private readonly INotificationRepository _repository;

        public NotificationService(INotificationRepository repository)
        {
            _repository = repository;
        }

        public async Task<NotificationDto> CreateNotificationAsync(NotificationDto notificationDto, string userId)
        {
            var notification = notificationDto.ToEntity(userId);

            await _repository.AddAsync(notification);
            await _repository.SaveChangesAsync();

            return notificationDto;
        }

        public async Task DeleteNotificationAsync(long notificationId, string userId)
        {
            var notification = await _repository.GetByIdAsync(notificationId);
            if (notification == null) { return; }
        
            if (notification.UserId != userId)
            {
                throw new UnauthorizedAccessException("You cannot delete this notification.");
            }

            _repository.Delete(notification);
            await _repository.SaveChangesAsync();
        }

        public async Task<NotificationDto?> GetNotificationByIdAsync(long id)
        {
            var notification = await _repository.GetByIdAsync(id);
            if (notification == null) { return null; }

            return notification.ToDto();
        }

        public async Task<List<NotificationDto>> GetNotificationsForUserAsync(string userId)
        {
            var notifications = await _repository.GetByUserIdAsync(userId);
            return notifications.Select(n => n.ToDto()).ToList();
        }
    }
}