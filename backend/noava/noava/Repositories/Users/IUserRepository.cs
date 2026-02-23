using noava.Models;
using noava.Models.Enums;

namespace noava.Repositories.Users
{
    public interface IUserRepository
    {
        Task<User?> GetByClerkIdAsync(string clerkId);
        Task<User> CreateAsync(User user);
        Task<User?> DeleteByClerkIdAsync(string clerkId);
        Task<List<User>> GetAllLocalUsersAsync();
        Task<User?> UpdateRoleAsync(string clerkId, UserRole newRole);
    }
}