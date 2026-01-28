using noava.Models;

namespace noava.Services.Contracts
{
    public interface IClassroomService
    {
        Task<Classroom> CreateAsync(Classroom classroom, string userId);
        Task<IEnumerable<Classroom>> GetAllByUserAsync(string userId);
        Task<Classroom?> GetByIdAsync(int id);
        Task<Classroom?> GetByJoinCodeAsync(string joinCode);
        string GenerateClassroomCode();
    }
}
