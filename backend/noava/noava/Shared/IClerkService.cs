using noava.DTOs.Clerk;

namespace noava.Shared
{
    public interface IClerkService
    {
        Task<ClerkUserResponseDto?> GetUserAsync(string clerkUserId);
        Task<IEnumerable<ClerkUserResponseDto>> GetUsersAsync(IEnumerable<string> clerkUserIds);
        Task<ClerkUserResponseDto?> GetUserByEmailAsync(string email);
    }
}