using noava.DTOs.Request.Notifications;
using noava.DTOs.Response.Notifications;
using noava.Models;

namespace noava.Mappers.Notifications
{
    public static class NotificationMapper
    {
        public static NotificationResponseDto ToDto(this Notification notification)
        {
            var dto = new NotificationResponseDto
            {
                Id = notification.Id,
                Type = notification.Type,
                TemplateKey = notification.TemplateKey,
                ParametersJson = notification.ParametersJson ?? string.Empty,
                Link = notification.Link ?? string.Empty,
                CreatedAt = notification.CreatedAt,
                Actions = notification.Actions.Select(a => a.ToDto()).ToList()
            };

            return dto;
        }

        public static Notification ToEntity(this NotificationRequestDto dto)
        {
            var entity = new Notification
            {
                UserId = dto.UserId,
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
