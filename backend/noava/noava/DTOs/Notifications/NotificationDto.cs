using noava.Models.Enums;

namespace noava.DTOs.Notifications
{
    public class NotificationDto
    {
        public long? Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public string TemplateKey { get; set; } = string.Empty;
        public string? ParametersJson { get; set; }
        public string? Link { get; set; }
        public List<NotificationActionDto>? Actions { get; set; } = new List<NotificationActionDto>();
        public DateTime? CreatedAt { get; set; }
    }
}