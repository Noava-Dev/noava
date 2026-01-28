using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface IClassroomRepository
    {
        Task<Classroom> GetByIdAsync(int id);
        Task<IEnumerable<Classroom>> GetAllAsync();
        Task AddAsync(Classroom classroom);
        Task UpdateAsync(Classroom classroom);
        Task DeleteAsync(int id);
        Task<Classroom> GetByJoinCodeAsync(string joinCode);
    }
}