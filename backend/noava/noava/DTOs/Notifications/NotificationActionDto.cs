using noava.Models.Enums;

namespace noava.DTOs.Notifications
{
    public class NotificationActionDto
    {
        public string LabelKey { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public HttpMethodType Method { get; set; } = HttpMethodType.POST;
    }
}
