using noava.Models;

namespace noava.Repositories.Classrooms
{
    public interface IClassroomDeckRepository
    {
        Task<bool> ExistsAsync(int classroomId, int deckId);
        Task<bool> ExistsAsync(IEnumerable<int> deckIds, int classroomId);
        Task AddAsync(ClassroomDeck classroomDeck);
        Task<ClassroomDeck?> GetAsync(int classroomId, int deckId);
        Task DeleteAsync(ClassroomDeck classroomDeck);
    }
}