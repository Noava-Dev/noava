using noava.Models.Enums;

namespace noava.DTOs.Notifications
{
    public class NotificationResponseDto
    {
        public long Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public string TemplateKey { get; set; } = string.Empty;
        public string ParametersJson { get; set; } = string.Empty;
        public string Link { get; set; } = string.Empty;
        public ICollection<NotificationActionResponseDto> Actions { get; set; } = new List<NotificationActionResponseDto>();
        public DateTime CreatedAt { get; set; }
    }
}