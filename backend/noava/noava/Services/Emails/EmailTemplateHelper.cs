using System.IO;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;

namespace noava.Services.Emails
{
    public static class EmailTemplateHelper
    {
        public static async Task<string> GetNotificationEmailAsync(
            string title,
            string message,
            string path,
            IConfiguration configuration,
            string buttonText = "View Notification")
        {
            var frontendBaseUrl = configuration["Frontend:BaseUrl"]
                ?? throw new InvalidOperationException("Frontend BaseUrl not configured");

            var buttonUrl = new Uri(new Uri(frontendBaseUrl), path).ToString();

            var template = await File.ReadAllTextAsync("EmailTemplates/notification.html");

            template = template.Replace("{{TITLE}}", title);
            template = template.Replace("{{MESSAGE}}", message);
            template = template.Replace("{{BUTTON_URL}}", buttonUrl);
            template = template.Replace("{{BUTTON_TEXT}}", buttonText);
            template = template.Replace("{{LOGO_URL}}", "cid:noava-logo");

            return template;
        }
    }
}