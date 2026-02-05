using noava.DTOs.Clerk;
using noava.DTOs.Schools;
using noava.Mappers.Schools;
using noava.Models;
using noava.Repositories.Schools;
using noava.Repositories.Users;
using noava.Shared;

namespace noava.Services.Schools
{
    public class SchoolService : ISchoolService
    {
        private readonly ISchoolRepository _schoolRepository;
        private readonly IClerkService _clerkService;

        public SchoolService(ISchoolRepository schoolRepository, IClerkService clerkService)
        {
            _schoolRepository = schoolRepository;
            _clerkService = clerkService;
        }

        // gets all unique clerk users for a list of schools. used to map user objects based on clerk id in the school dto's (clerkid: userobject)
        private async Task<Dictionary<string, ClerkUserResponseDto>> GetClerkUsersForSchoolAsync(IEnumerable<School> schools)
        {
            var creatorIds = schools.Select(s => s.CreatedBy);
            var schoolAdminIds = schools.SelectMany(s => s.SchoolAdmins.Select(sa => sa.ClerkId));

            var allClerkIds = creatorIds.Concat(schoolAdminIds).Distinct().ToList();

            var clerkUsers = await _clerkService.GetUsersAsync(allClerkIds);

            return clerkUsers.ToDictionary(u => u.ClerkId);
        }


        public async Task<List<SchoolResponseDto>> GetAllSchoolsAsync()
        {
            var schools = await _schoolRepository.GetAllSchoolsAsync();

            var clerkUsers = await GetClerkUsersForSchoolAsync(schools);

            var schoolDtos = schools.Select(school => school.ToDetailsDto(clerkUsers)).ToList();

            return schoolDtos;
        }

        public async Task<SchoolResponseDto> GetSchoolByIdAsync(int id)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(id);

            if(school == null)
            {
                throw new KeyNotFoundException("School not found.");
            } else
            {
                var clerkUsers = await GetClerkUsersForSchoolAsync(new List<School> { school });
                var schoolDto = school.ToDetailsDto(clerkUsers);
                return schoolDto;
            }
        }

        public async Task<School> CreateSchoolAsync(SchoolRequestDto request)
        {
            var schoolAdmins = new List<SchoolAdmin>();

            // fetch clerk users by email (should be improved by adding a bulk fetch method in ClerkService)
            foreach (var email in request.SchoolAdminEmails.Distinct())
            {
                var user = await _clerkService.GetUserByEmailAsync(email);

                if (user != null)
                {
                    schoolAdmins.Add(new SchoolAdmin
                    {
                        ClerkId = user.ClerkId
                    });
                }
            }

            if (schoolAdmins.Count == 0)
            {
                throw new ArgumentException("At least one valid school admin email is required.");
            }

            var school = request.ToEntity(schoolAdmins);

            return await _schoolRepository.CreateSchoolAsync(school);
        }

        public async Task<School> UpdateSchoolAsync(int schoolId, SchoolRequestDto request)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(schoolId);

            if (school == null)
            {
                throw new KeyNotFoundException("School not found.");
            }

            school.Name = request.SchoolName.Trim();
            school.UpdatedAt = DateTime.UtcNow;

            return await _schoolRepository.UpdateSchoolAsync(school);
        }

        public async Task DeleteSchoolAsync(int id)
        {
            await _schoolRepository.DeleteSchoolAsync(id);
        }

        public async Task AddSchoolAdminAsync(int schoolId, string userEmail)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(schoolId);
            if (school == null)
            {
                throw new KeyNotFoundException("School not found.");
            }

            var user = await _clerkService.GetUserByEmailAsync(userEmail);
            if (user == null)
            {
                throw new KeyNotFoundException("User not found.");
            }

            var existingAdmin = await _schoolRepository.GetSchoolAdminAsync(school.Id, user.ClerkId);
            if (existingAdmin != null)
            {
                throw new ArgumentException("User is already a school admin.");
            }

            var schoolAdmin = new SchoolAdmin
            {
                SchoolId = school.Id,
                ClerkId = user.ClerkId
            };
            await _schoolRepository.AddAdminAsync(schoolAdmin);
        }

        public async Task RemoveSchoolAdminAsync(int schoolId, string clerkId)
        {
            var schoolAdmin = await _schoolRepository.GetSchoolAdminAsync(schoolId, clerkId);
            await _schoolRepository.RemoveAdminAsync(schoolAdmin);
        }
    }
}
