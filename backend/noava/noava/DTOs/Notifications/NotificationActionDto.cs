namespace noava.DTOs.Notifications
{
    public class NotificationActionDto
    {
        public string LabelKey { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public HttpMethod Method { get; set; } = HttpMethod.Post;
    }
}
