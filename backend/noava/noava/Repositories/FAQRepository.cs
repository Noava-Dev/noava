using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace Noava.Repositories
{
    public class FaqRepository
    {
        private readonly NoavaDbContext _context;

        public FaqRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<FAQ>> GetAllAsync()
        {
            return await _context.FAQs.ToListAsync();
        }
    }
}