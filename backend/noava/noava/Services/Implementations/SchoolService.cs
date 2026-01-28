using noava.Models;
using noava.Repositories.Contracts;
using noava.Services.Contracts;

namespace noava.Services.Implementations
{
    public class SchoolService : ISchoolService
    {
        private readonly ISchoolRepository _schoolRepository;

        public SchoolService(ISchoolRepository schoolRepository)
        {
            _schoolRepository = schoolRepository;
        }

        public async Task<List<School>> GetSchoolsAsync()
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
        //add SchoolAdmins:
        public async Task AddSchoolAdminsAsync(int schoolId, IEnumerable<int> newAdminUserIds)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(schoolId);
            if (school is null)
                throw new InvalidOperationException("School not found.");

            var existingAdminIds = school.SchoolAdmins.Select(a => a.UserId).ToList();

            foreach (var userId in newAdminUserIds.Distinct())
            {
                if (!existingAdminIds.Contains(userId))
                {
                    school.SchoolAdmins.Add(new SchoolAdmin
                    {
                        SchoolId = school.Id,
                        UserId = userId
                    });
                }
            }

            school.UpdatedAt = DateTime.UtcNow;
            await _schoolRepository.UpdateSchoolAsync(school);
        }

        //remove admins
        public async Task RemoveSchoolAdminsAsync(int schoolId, IEnumerable<int> adminUserIdsToRemove)
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(schoolId);
            if (school is null)
                throw new InvalidOperationException("School not found.");

            school.SchoolAdmins = school.SchoolAdmins
                .Where(a => !adminUserIdsToRemove.Contains(a.UserId))
                .ToList();

            school.UpdatedAt = DateTime.UtcNow;
            await _schoolRepository.UpdateSchoolAsync(school);
        }



        public async Task<School> CreateSchoolAsync( string name, int createdByUserId, IEnumerable<int> adminUserIds)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("School name is required.");

            var admins = adminUserIds?.Distinct().ToList() ?? [];
            if (admins.Count == 0)
                throw new ArgumentException("At least one school admin is required.");

            var school = new School
            {
                Name = name,
                CreatedByUserId = createdByUserId,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                SchoolAdmins = admins.Select(id => new SchoolAdmin
                { 
                    UserId = id
                }).ToList()
            };

            return await _schoolRepository.CreateSchoolAsync(school);
        }

        public async Task<School> UpdateSchoolAsync(
            int schoolId,
            string name
 )
        {
            var school = await _schoolRepository.GetSchoolByIdAsync(schoolId);
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
