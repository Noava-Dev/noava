using noava.DTOs.Clerk;
using noava.Models;
using System.Security.Claims;
using noava.Models.Enums;

namespace noava.Services.Users
{
    public interface IUserService
    {
        Task<User> SyncUserAsync(string clerkId);
        Task UpdateReceiveNotificationEmails(string clerkId, bool receive);
        Task<bool> GetUserEmailNotificationsPreference(string clerkId);
        string? GetUserId(ClaimsPrincipal? user);
        Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(string clerkUserId);
        Task<User?> UpdateUserRoleAsync(string clerkId, UserRole newRole);
    }
}