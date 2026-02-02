using noava.Models;

namespace noava.Services.Users
{
    public interface IUserService
    {
        Task<User> SyncUserAsync(string clerkId);
    }
}