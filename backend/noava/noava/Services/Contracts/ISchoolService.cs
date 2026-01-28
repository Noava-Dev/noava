using noava.Models;

namespace noava.Services.Contracts
{
    public interface ISchoolService
    {
        Task<List<School>> GetAllSchoolsAsync();
        Task<School?> GetSchoolByIdAsync(int id);
        Task<School> CreateSchoolAsync(
                string name,
                int createdByUserId,
                IEnumerable<int> adminUserIds
            );
        Task<School> UpdateSchoolAsync(School school);
        Task DeleteSchoolAsync(int id);
    }
}
