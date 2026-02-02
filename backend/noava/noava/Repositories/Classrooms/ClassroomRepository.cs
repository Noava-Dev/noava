using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.Classrooms
{
    public class ClassroomRepository : IClassroomRepository
    {
        private readonly NoavaDbContext _context;

        public ClassroomRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task AddAsync(Classroom classroom)
        {
            await _context.Classrooms.AddAsync(classroom);
        }

        public async Task<IEnumerable<Classroom>> GetAllAsync()
        {
            return await _context.Classrooms
                                 .OrderByDescending(c => c.CreatedAt)
                                 .ToListAsync();
        }

        public async Task<IEnumerable<Classroom>> GetAllByUserAsync(string userId)
        {
            return await _context.Classrooms
                                 .Include(c => c.ClassroomUsers)
                                 .Where(c => c.ClassroomUsers.Any(cu => cu.UserId == userId))
                                 .OrderByDescending(c => c.CreatedAt)
                                 .ToListAsync();
        }

        public async Task<Classroom?> GetByIdAsync(int id)
        {
            return await _context.Classrooms
                .Include(c => c.ClassroomUsers)
                .FirstOrDefaultAsync(c => c.Id == id);
        }

        public Task UpdateAsync(Classroom classroom)
        {
            _context.Classrooms.Update(classroom);
            return Task.CompletedTask;
        }

        public async Task<Classroom?> GetByJoinCodeAsync(string joinCode)
        {
            return await _context.Classrooms
                .Include(c => c.ClassroomUsers)
                .FirstOrDefaultAsync(c => c.JoinCode == joinCode);
        }

        public void Delete(Classroom classroom)
        {
            _context.Classrooms.Remove(classroom);
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }
    }
}