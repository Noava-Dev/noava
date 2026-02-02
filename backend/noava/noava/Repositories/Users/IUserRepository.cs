using noava.Models;

namespace noava.Repositories.Users
{
    public interface IUserRepository
    {
        Task<User?> GetByClerkIdAsync(string clerkId);
        Task<User> CreateAsync(User user);
    }
}