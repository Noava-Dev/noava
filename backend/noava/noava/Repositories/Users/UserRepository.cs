using DocumentFormat.OpenXml.InkML;
using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Exceptions;
using noava.Models;
using noava.Models.Enums;

namespace noava.Repositories.Users
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

        public async Task<User?> DeleteByClerkIdAsync(string clerkId)
        {
            var user = await _db.Users
                .SingleOrDefaultAsync(u => u.ClerkId == clerkId);

            if (user == null)
            {
                return null;
            }

            _db.Users.Remove(user);
            await _db.SaveChangesAsync();

            return user;
        }
        public async Task<List<User>> GetAllLocalUsersAsync()
        {
            return await _db.Users.ToListAsync();
        }

        public async Task<User?> UpdateRoleAsync(string clerkId, UserRole newRole)
        {
            var user = await _db.Users.SingleOrDefaultAsync(u => u.ClerkId == clerkId);

            if (user == null)
                return null;

            user.Role = newRole;
            await _db.SaveChangesAsync();

            return user;
        }

        public async Task UpdateReceiveNotificationEmailsAsync(string clerkId, bool receive)
        {
            var user = await GetByClerkIdAsync(clerkId);
            if (user == null)
                throw new NotFoundException("User not found");

            user.ReceiveNotificationEmails = receive;

            _db.Users.Update(user);
            await _db.SaveChangesAsync();
        }

        public async Task<bool> GetReceiveNotificationEmailsAsync(string clerkId)
        {
            var user = await _db.Users
                .AsNoTracking()
                .FirstOrDefaultAsync(u => u.ClerkId == clerkId);

            if (user == null)
                throw new NotFoundException("User not found");

            return user.ReceiveNotificationEmails;
        }
    }
}