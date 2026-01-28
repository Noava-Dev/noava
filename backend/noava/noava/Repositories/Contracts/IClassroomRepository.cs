using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface IClassroomRepository
    {
        Task<Classroom?> GetByIdAsync(int id);
        Task<IEnumerable<Classroom>> GetAllAsync();
        Task<IEnumerable<Classroom>> GetAllByUserAsync(string userId);

        Task AddAsync(Classroom classroom);
        Task UpdateAsync(Classroom classroom);
        void Delete(Classroom classroom);
        Task SaveChangesAsync();
        Task<Classroom?> GetByJoinCodeAsync(string joinCode);
    }
}