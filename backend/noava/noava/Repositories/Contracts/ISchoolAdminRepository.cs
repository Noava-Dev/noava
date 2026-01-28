using noava.Models;

namespace noava.Repositories.Contracts
{
    public interface ISchoolAdminRepository
    {
        Task AddAdminsAsync(int schoolId, IEnumerable<string> userIds);
        Task RemoveAdminsAsync(int schoolId, IEnumerable<string> userIds);
    }
}
