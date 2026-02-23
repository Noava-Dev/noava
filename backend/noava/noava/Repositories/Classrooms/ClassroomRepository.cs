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

        public async Task<Classroom> AddAsync(Classroom classroom)
        {
            await _context.Classrooms.AddAsync(classroom);
            await _context.SaveChangesAsync();
            return classroom;
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

        public async Task<Classroom?> GetByIdAsync(int classroomId)
        {
            return await _context.Classrooms
                .Include(c => c.ClassroomUsers)
                .Include(c => c.ClassroomDecks)
                    .ThenInclude(cd => cd.Deck)
                .FirstOrDefaultAsync(c => c.Id == classroomId);
        }

        public async Task<Classroom> UpdateAsync(Classroom classroom)
        {
            _context.Classrooms.Update(classroom);
            await _context.SaveChangesAsync();
            return classroom;
        }

        public async Task<Classroom?> GetByJoinCodeAsync(string joinCode)
        {
            return await _context.Classrooms
                .Include(c => c.ClassroomUsers)
                .FirstOrDefaultAsync(c => c.JoinCode == joinCode);
        }

        public async Task<List<int>> GetClassroomIdsForDeckAndUser(int deckId, string userId)
        {
            return await _context.Classrooms
                .Where(c =>
                    c.ClassroomDecks.Any(cd => cd.DeckId == deckId) &&
                    c.ClassroomUsers.Any(cu => cu.UserId == userId))
                .Select(c => c.Id)
                .ToListAsync();
        }

        public async Task<bool> DeleteAsync(Classroom classroom)
        {
            _context.Classrooms.Remove(classroom);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task SaveChangesAsync()
        {
            await _context.SaveChangesAsync();
        }

    }
}