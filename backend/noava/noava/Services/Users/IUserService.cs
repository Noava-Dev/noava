using noava.DTOs.Clerk;
using noava.Models;
using System.Security.Claims;

namespace noava.Services.Users
{
    public interface IUserService
    {
        Task<User> SyncUserAsync(string clerkId);
        string? GetUserId(ClaimsPrincipal? user);
        Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersAsync();
        Task<bool> DeleteUserAsync(string clerkUserId);
    }
}