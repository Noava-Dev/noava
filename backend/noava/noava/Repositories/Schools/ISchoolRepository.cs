using noava.Models;

namespace noava.Repositories.Schools
{
    public interface ISchoolRepository
    {
        Task<List<School>> GetAllSchoolsAsync();
        Task<School> GetSchoolByIdAsync(int id);
        Task<School> CreateSchoolAsync(School school);
        Task<School> UpdateSchoolAsync(School school);
        Task DeleteSchoolAsync(int id);
        Task<SchoolAdmin> GetSchoolAdminAsync(int schoolId, string clerkId);
        Task AddAdminAsync(SchoolAdmin schoolAdmin);
        Task RemoveAdminAsync(SchoolAdmin schoolAdmin);
    }
}