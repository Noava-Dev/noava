using noava.DTOs.Notifications;
using noava.Models;

namespace noava.Mappers.Notifications
{
    public static class NotificationActionMapper
    {
        public static NotificationActionDto ToDto(this NotificationAction action)
        {
            return new NotificationActionDto
            {
                LabelKey = action.LabelKey,
                Endpoint = action.Endpoint,
                Method = action.Method
            };
        }

        public static NotificationAction ToEntity(this NotificationActionDto dto)
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
