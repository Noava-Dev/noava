using noava.DTOs.Response.Users;

namespace noava.Shared.Contract
{
    public interface IClerkService
    {
        Task<ClerkUserResponseDto?> GetUserAsync(string clerkUserId);
        Task<IEnumerable<ClerkUserResponseDto>> GetUsersAsync(IEnumerable<string> clerkUserIds);
    }
}