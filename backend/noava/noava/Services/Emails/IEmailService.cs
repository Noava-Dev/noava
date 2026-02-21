namespace noava.Services.Emails
{
    public interface IEmailService
    {
        Task SendNotificationEmailAsync(string to, string subject, string body);
    }
}