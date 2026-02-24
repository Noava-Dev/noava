using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.DTOs.ContactMessages;
using noava.Models;
using System;

namespace noava.Repositories.ContactMessages
{
    public class ContactMessageRepository : IContactMessageRepository
    {
        private readonly NoavaDbContext _context;

        public ContactMessageRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(ContactMessage entity)
        {
            await _context.ContactMessages.AddAsync(entity);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteAsync(ContactMessage entity)
        {
            entity.CreatedAt = DateTime.UtcNow;

            _context.ContactMessages.Remove(entity);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<ContactMessage>> GetAllAsync(ContactMessageFilterDto filter)
        {
            var query = _context.ContactMessages
                .AsNoTracking()
                .AsQueryable();

            if (filter.Status.HasValue)
            {
                query = query.Where(x => x.Status == filter.Status.Value);
            }

            if (filter.Subject.HasValue)
            {
                query = query.Where(x => x.Subject == filter.Subject.Value);
            }

            return await query
                .OrderByDescending(x => x.CreatedAt)
                .ToListAsync();
        }

        public async Task<ContactMessage?> GetByIdAsync(int id)
        {
            return await _context.ContactMessages
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.Id == id);
        }
    }
}