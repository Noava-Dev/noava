using noava.Models.Enums;

namespace noava.Models
{
    public class Notification
    {
        public long Id { get; set; }
        public string UserId { get; set; } = string.Empty;

        public NotificationType Type { get; set; }
        public string TemplateKey { get; set; } = string.Empty;

        public string? ParametersJson { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public bool IsRead { get; set; }
    }
}