using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;
using noava.Repositories.Contracts;

namespace noava.Repositories.Implementations
{
    public class SchoolRepository : ISchoolRepository
    {
        private readonly NoavaDbContext _db;

        public SchoolRepository(NoavaDbContext db)
        {
            _context = context;
        }

        public async Task<List<School>> GetAllSchoolsAsync()
        {
            return await _db.Schools 
            .Include(s => s.Admins)
            .ToListAsync();

        }

        public async Task<School> GetSchoolByIdAsync(int id)
        {
            return await _db.Schools
            //.Include is needed so i can immediately load the admins for that school as well
            // makes it easier to update and display the admins too.
            .Include(s => s.Admins) 
            .FirstOrDefaultAsync(s => s.Id == id);
            
        }

        public async Task<School> CreateSchoolAsync(School school)
        {
            _db.Schools.Add(school);
            await _db.SaveChangesAsync();
            return school;
        }

        public async Task<School> UpdateSchoolAsync(School school)
        {
            _db.Schools.Update(school);
            await _db.SaveChangesAsync();
            return school;
        }

        public async Task DeleteSchoolAsync(int id)
        {
            var school = await _db.Schools.FindAsync(id);
            if(school != null){
                _db.Schools.Remove(school);
                await _db.SaveChangesAsync();
            }
        }
    }
}