using noava.Models;
using noava.Repositories.Contracts;
using noava.Repositories.Implementations;
using noava.Services.Contracts;
using noava.Shared.Clerk;

namespace noava.Services.Implementations
{
    public class SchoolService : ISchoolService
    {
        private readonly ISchoolRepository _schoolRepository;
        private readonly ISchoolAdminRepository _schoolAdminRepository;
        private readonly IUserRepository _userRepository;
        private readonly IClerkSchoolService _clerkService;

        public SchoolService(ISchoolRepository schoolRepository, ISchoolAdminRepository schoolAdminRepository, IUserRepository userRepository, IClerkSchoolService clerkService)
        {
            _schoolRepository = schoolRepository;
            _schoolAdminRepository = schoolAdminRepository;
            _userRepository = userRepository;
            _clerkService = clerkService;
        }


        public async Task<List<School>> GetAllSchoolsAsync()
        {
            return await _schoolRepository.GetAllSchoolsAsync();
        }

        public async Task<School> GetSchoolByIdAsync(int id)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(id);

            if(school is null)
            {
                throw new InvalidOperationException("School not found.");
            }

            return school;
        }

        // add and delete SchoolAdmins instead of adding all the logic inside UpdateSchoolAsync
        public async Task AddSchoolAdminsAsync(int schoolId, IEnumerable<string> newAdminUserIds)
        {
            await _schoolAdminRepository.AddAdminsAsync(schoolId, newAdminUserIds);
        }

        public async Task RemoveSchoolAdminsAsync(int schoolId, IEnumerable<string> adminUserIdsToRemove)
        {
            await _schoolAdminRepository.RemoveAdminsAsync(schoolId, adminUserIdsToRemove);
        }

        public async Task<School> CreateSchoolAsync( string name, string createdByUserId, IEnumerable<string> schoolAdminEmails)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("School name is required.");

            if (schoolAdminEmails == null || !schoolAdminEmails.Any())
                throw new ArgumentException("At least one school admin is required.");

            var schoolAdminUserIds = await _clerkService.GetClerkUserIdByEmailsAsync(schoolAdminEmails);


            var school = new School
            {
                Name = name,
                CreatedByUserId = createdByUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                SchoolAdmins = schoolAdminUserIds.Select(id => new SchoolAdmin
                {
                    UserId = id
                }).ToList()
            };

            return await _schoolRepository.CreateSchoolAsync(school);
        }

        public async Task<School> UpdateSchoolAsync(int schoolId, string name)
        {
            School school = await _schoolRepository.GetSchoolByIdAsync(schoolId);
            if (school is null)
                throw new InvalidOperationException("School not found.");

            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("School name is required.");

            school.Name = name.Trim();
            school.UpdatedAt = DateTime.UtcNow;

            return await _schoolRepository.UpdateSchoolAsync(school);
        }

        //TODO: check for correct admin roles before deleting
        public async Task DeleteSchoolAsync(int id)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(id);
            if (school is null)
                throw new InvalidOperationException("School not found.");

            await _schoolRepository.DeleteSchoolAsync(id);
        }
    }
}
