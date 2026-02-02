using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using System;

namespace noava.Repositories.Notifications
{
    public class NotificationRepository : INotificationRepository
    {
        private readonly NoavaDbContext _context;

        public NotificationRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<List<Notification>> GetByUserIdAsync(string userId)
        {
            return await _context.Notifications
                                 .Include(n => n.Actions)
                                 .Where(n => n.UserId == userId)
                                 .OrderByDescending(n => n.CreatedAt)
                                 .ToListAsync();
        }

        public async Task<Notification?> GetByIdAsync(long id)
        {
            return await _context.Notifications
                                 .Include(n => n.Actions)
                                 .FirstOrDefaultAsync(n => n.Id == id);
        }

        public async Task AddAsync(Notification notification)
        {
            await _context.Notifications.AddAsync(notification);
        }

        public void Delete(Notification notification)
        {
            _context.Notifications.Remove(notification);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}