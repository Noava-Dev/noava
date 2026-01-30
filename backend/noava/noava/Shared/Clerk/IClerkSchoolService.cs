using noava.DTOs.Schools;

namespace noava.Shared.Clerk
{
    public interface IClerkSchoolService
    {
        Task<List<string>> GetClerkUserIdByEmailsAsync(IEnumerable<string> emails);
        Task<List<UserSummaryDto>> GetUsersByClerkIdsAsync(IEnumerable<string> clerkIds);
    }
}
