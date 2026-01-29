using noava.Models.Enums;

namespace noava.DTOs.Request.Notifications
{
    public class NotificationActionRequestDto
    {
        public string LabelKey { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public HttpMethodType Method { get; set; } = HttpMethodType.POST;
    }
}