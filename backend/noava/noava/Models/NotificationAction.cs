namespace noava.Models
{
    public class NotificationAction
    {
        public long Id { get; set; }
        public long NotificationId { get; set; }
        public Notification Notification { get; set; } = null!;
        public string LabelKey { get; set; } = string.Empty;
        public string Endpoint { get; set; } = string.Empty;
        public HttpMethod Method { get; set; } = HttpMethod.Post;
    }
}