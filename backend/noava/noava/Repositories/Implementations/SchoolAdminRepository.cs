using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Contracts;

namespace noava.Repositories.Implementations
{
    public class SchoolAdminRepository : ISchoolAdminRepository
    {
        private readonly NoavaDbContext _context;
        private readonly IUserRepository _userRepository;

        public SchoolAdminRepository(NoavaDbContext context, IUserRepository userRepository)
        {
            _context = context;
            _userRepository = userRepository;
        }

        public async Task AddAdminsAsync(int schoolId, IEnumerable<string> userIds)
        {
            var users = await _context.Users
                .Where(u => userIds.Contains(u.ClerkId))
                .ToListAsync();

            var existing = await _context.SchoolAdmins
                                    .Where(sa => sa.SchoolId == schoolId)
                                    .Select(sa => sa.UserId)
                                    .ToListAsync();

            var adminsToAdd = users
            .Where(u => !existing.Contains(u.ClerkId))
            .Select(u => new SchoolAdmin
            {
                SchoolId = schoolId,
                UserId = u.ClerkId,
                User = u
            })
            .ToList();

                await _context.SchoolAdmins.AddRangeAsync(adminsToAdd);
                await _context.SaveChangesAsync();
            }

        public async Task RemoveAdminsAsync(int schoolId, IEnumerable<string> clerkUserIds)
        {
            var users = await _context.Users
                .Where(u => clerkUserIds.Contains(u.ClerkId))
                .Select(u => u.ClerkId)
                .ToListAsync();

            var toRemove = await _context.SchoolAdmins
                .Where(sa => sa.SchoolId == schoolId && users.Contains(sa.UserId))
                .ToListAsync();

            _context.SchoolAdmins.RemoveRange(toRemove);
            await _context.SaveChangesAsync();
        }

    }
}
