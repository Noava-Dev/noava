using noava.Models;

namespace noava.Repositories.Classrooms
{
    public interface IClassroomRepository
    {
        Task<Classroom?> GetByIdAsync(int id);
        Task<IEnumerable<Classroom>> GetAllAsync();
        Task<IEnumerable<Classroom>> GetAllByUserAsync(string userId);
        Task<bool> IsTeacherOfClassroomAsync(int classroomId, string userId);
        Task<Classroom> AddAsync(Classroom classroom);
        Task<Classroom> UpdateAsync(Classroom classroom);
        Task<bool> DeleteAsync(Classroom classroom);
        Task<Classroom?> GetByJoinCodeAsync(string joinCode);
        Task<List<int>> GetClassroomIdsForDeckAndUser(int deckId, string userId);
        Task SaveChangesAsync();
    }
}