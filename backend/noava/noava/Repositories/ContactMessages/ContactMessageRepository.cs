using Microsoft.EntityFrameworkCore;
using noava.Data;
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

        public async Task<IEnumerable<ContactMessage>> GetAllAsync()
        {
            return await _context.ContactMessages
                .AsNoTracking()
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