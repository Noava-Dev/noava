using noava.DTOs.Notifications;
using noava.Models;

namespace noava.Mappers.Notifications
{
    public static class NotificationMapper
    {
        public static NotificationDto ToDto(this Notification notification)
        {
            var dto = new NotificationDto
            {
                Id = notification.Id,
                Type = notification.Type,
                TemplateKey = notification.TemplateKey,
                ParametersJson = notification.ParametersJson,
                Link = notification.Link,
                CreatedAt = notification.CreatedAt,
                Actions = notification.Actions.Select(a => a.ToDto()).ToList()
            };

            return dto;
        }

        public static Notification ToEntity(this NotificationDto dto, string userId)
        {
            var entity = new Notification
            {
                UserId = userId,
                Type = dto.Type,
                TemplateKey = dto.TemplateKey,
                ParametersJson = dto.ParametersJson,
                Link = dto.Link,
                Actions = dto.Actions?.Select(a => a.ToEntity()).ToList()
                  ?? []
            };

            return entity;
        }
    }
}
