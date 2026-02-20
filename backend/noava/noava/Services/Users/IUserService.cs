using noava.Models;
using System.Security.Claims;

namespace noava.Services.Users
{
    public interface IUserService
    {
        Task<User> SyncUserAsync(string clerkId);
        Task UpdateReceiveNotificationEmails(string clerkId, bool receive);
        Task<bool> GetUserEmailNotificationsPreference(string clerkId);
        string? GetUserId(ClaimsPrincipal? user);
    }
}