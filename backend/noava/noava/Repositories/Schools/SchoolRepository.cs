using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.Schools
{
    public class SchoolRepository : ISchoolRepository
    {
        private readonly NoavaDbContext _context;

        public SchoolRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<List<School>> GetAllSchoolsAsync()
        {
            return await _context.Schools
               .Include(s => s.SchoolAdmins)
               .Include(s => s.CreatedByUser)
               .ToListAsync();
        }

        public async Task<School> GetSchoolByIdAsync(int id)
        {
            return await _context.Schools
                .Include(s => s.SchoolAdmins)
                .Include(s => s.CreatedByUser)
                .FirstAsync(s => s.Id == id);
        }

        public async Task<School> CreateSchoolAsync(School school)
        {
            _context.Schools.Add(school);
            await _context.SaveChangesAsync();
            return school;
        }

        public async Task<School> UpdateSchoolAsync(School school)
        {
            _context.Schools.Update(school);
            await _context.SaveChangesAsync();
            return school;
        }

        public async Task DeleteSchoolAsync(int id)
        {
            var school = await _context.Schools.FindAsync(id);

            if (school == null)
            {
                throw new KeyNotFoundException();
            }

            _context.Schools.Remove(school);
            await _context.SaveChangesAsync();
        }

        public async Task<SchoolAdmin> GetSchoolAdminAsync(int schoolId, string clerkId)
        {
            return await _context.SchoolAdmins
                .FirstAsync(sa => sa.SchoolId == schoolId && sa.ClerkId == clerkId);
        }

        public async Task AddAdminAsync(SchoolAdmin schoolAdmin)
        {
            _context.SchoolAdmins.Add(schoolAdmin);
            await _context.SaveChangesAsync();
        }

        public async Task RemoveAdminAsync(SchoolAdmin schoolAdmin)
        {
            _context.SchoolAdmins.Remove(schoolAdmin);
            await _context.SaveChangesAsync();
        }
    }
}