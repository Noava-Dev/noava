using noava.DTOs.Schools;
using noava.Models;

namespace noava.Services.Schools
{
    public interface ISchoolService
    {
        Task<List<SchoolResponseDto>> GetAllSchoolsAsync();
        Task<SchoolResponseDto> GetSchoolByIdAsync(int id);
        Task<School> CreateSchoolAsync(SchoolRequestDto request);
        Task<School> UpdateSchoolAsync(int schoolId, SchoolRequestDto request);
        Task DeleteSchoolAsync(int id);
        Task AddSchoolAdminAsync(int schoolId, string userEmail);
        Task RemoveSchoolAdminAsync(int schoolId, string clerkId);
    }
}
