using noava.Models;

namespace noava.Services.Contracts
{
    public interface IUserService
    {
        Task<User> SyncUserAsync(string clerkId);
    }
}