using noava.Models;

namespace noava.Services.Contracts
{
    public interface ISchoolService
    {
        Task<List<School>> GetAllSchoolsAsync();
        Task<School?> GetSchoolByIdAsync(int id);
        Task<School> CreateSchoolAsync(
                string name,
                string createdByUserId,
                IEnumerable<string> adminUserIds
            );
        Task<School> UpdateSchoolAsync(int schoolId, string name);
        Task DeleteSchoolAsync(int id);
    }
}
