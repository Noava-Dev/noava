using noava.Models.Enums;

namespace noava.DTOs.Notifications
{
    public class NotificationRequestDto
    {
        public string UserId { get; set; } = string.Empty;
        public NotificationType Type { get; set; }
        public string TemplateKey { get; set; } = string.Empty;
        public string? ParametersJson { get; set; } 
        public string? Link { get; set; }
        public ICollection<NotificationActionRequestDto>? Actions { get; set; } = new List<NotificationActionRequestDto>();
    }
}
