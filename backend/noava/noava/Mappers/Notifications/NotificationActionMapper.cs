using noava.DTOs.Notifications;
using noava.Models;

namespace noava.Mappers.Notifications
{
    public static class NotificationActionMapper
    {
        public static NotificationActionResponseDto ToDto(this NotificationAction action)
        {
            return new NotificationActionResponseDto
            {
                LabelKey = action.LabelKey,
                Endpoint = action.Endpoint,
                Method = action.Method
            };
        }

        public static NotificationAction ToEntity(this NotificationActionRequestDto dto)
        {
            return new NotificationAction
            {
                LabelKey = dto.LabelKey,
                Endpoint = dto.Endpoint,
                Method = dto.Method
            };
        }
    }
}
