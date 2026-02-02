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

        //Get all schools
        public async Task<List<School>> GetAllSchoolsAsync()
        {
            return await _context.Schools
               .Include(s => s.SchoolAdmins)
               .Include(s => s.CreatedBy)
               .ToListAsync();

        }

        //Get schools by Id
        public async Task<School?> GetSchoolByIdAsync(int id)
        {
            return await _context.Schools
                .Include(s => s.SchoolAdmins)
                .Include(s => s.CreatedBy)
                .FirstOrDefaultAsync(s => s.Id == id);

            //TODO: if school = null there should be a catch

        }

        //Create
        public async Task<School> CreateSchoolAsync(School school)
        {
            _context.Schools.Add(school);
            await _context.SaveChangesAsync();
            return school;
        }

        //Update
        public async Task<School> UpdateSchoolAsync(School school)
        {
            _context.Schools.Update(school);
            await _context.SaveChangesAsync();
            return school;
        }

        //Delete
        public async Task DeleteSchoolAsync(int id)
        {
            var school = await _context.Schools.FindAsync(id);

            if(school != null){
                _context.Schools.Remove(school);
                await _context.SaveChangesAsync();
            }
        }

    }
}