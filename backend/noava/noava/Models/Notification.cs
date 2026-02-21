using noava.Models.Enums;

namespace noava.Models
{
    public class Notification
    {
        public long Id { get; set; }
        public string UserId { get; set; } = string.Empty;
        public User User { get; set; } = null!;
        public NotificationType Type { get; set; }
        public string TitleKey { get; set; } = string.Empty;
        public string TemplateKey { get; set; } = string.Empty;
        public string? ParametersJson { get; set; }
        public string? Link { get; set; }
        public List<NotificationAction> Actions { get; set; } = [];
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}