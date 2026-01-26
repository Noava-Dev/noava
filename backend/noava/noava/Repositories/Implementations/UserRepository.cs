using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Contracts;

namespace noava.Repositories.Implementations
{
    public class UserRepository : IUserRepository
    {
        private readonly NoavaDbContext _db;

        public UserRepository(NoavaDbContext db)
        {
            _db = db;
        }

        public async Task<User?> GetByClerkIdAsync(string clerkId)
        {
            return await _db.Users
                .SingleOrDefaultAsync(u => u.ClerkId == clerkId);
        }

        public async Task<User> CreateAsync(User user)
        {
            _db.Users.Add(user);
            await _db.SaveChangesAsync();
            return user;
        }
    }
}
