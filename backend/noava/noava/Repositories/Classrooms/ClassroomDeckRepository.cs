using Microsoft.EntityFrameworkCore;
using noava.Data;
using noava.Models;

namespace noava.Repositories.Classrooms
{
    public class ClassroomDeckRepository : IClassroomDeckRepository
    {
        private readonly NoavaDbContext _context;

        public ClassroomDeckRepository(NoavaDbContext context)
        {
            _context = context;
        }

        public async Task<bool> ExistsAsync(int classroomId, int deckId)
        {
            return await _context.ClassroomDecks
                .AnyAsync(cd => cd.ClassroomId == classroomId && cd.DeckId == deckId);
        }

        public async Task AddAsync(ClassroomDeck classroomDeck)
        {
            _context.ClassroomDecks.Add(classroomDeck);
            await _context.SaveChangesAsync();
        }

        public async Task<ClassroomDeck?> GetAsync(int classroomId, int deckId)
        {
            return await _context.ClassroomDecks
                .FirstOrDefaultAsync(cd =>
                    cd.ClassroomId == classroomId &&
                    cd.DeckId == deckId);
        }

        public async Task DeleteAsync(ClassroomDeck classroomDeck)
        {
            _context.ClassroomDecks.Remove(classroomDeck);
            await _context.SaveChangesAsync();
        }
    }
}