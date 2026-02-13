using noava.DTOs.Classrooms;
using noava.DTOs.Clerk;
using noava.DTOs.Schools;
using noava.Mappers.Schools;
using noava.Models;
using noava.Repositories.Classrooms;
using noava.Repositories.Schools;
using noava.Repositories.Users;
using noava.Shared;

namespace noava.Services.Schools
{
    public class SchoolService : ISchoolService
    {
        private readonly ISchoolRepository _schoolRepository;
        private readonly IClerkService _clerkService;
        private readonly IClassroomRepository _classroomRepository;

        public SchoolService(ISchoolRepository schoolRepository, IClerkService clerkService, IClassroomRepository classroomRepository)
        {
            _schoolRepository = schoolRepository;
            _clerkService = clerkService;
            _classroomRepository = classroomRepository;
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

            var schoolDtos = schools.Select(school => 
                school.ToDetailsDto(clerkUsers, school.Classrooms?.ToList() ?? [])).ToList();

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
                var classrooms = await _schoolRepository.GetClassroomsBySchoolIdAsync(id);
                var clerkUsers = await GetClerkUsersForSchoolAsync(new List<School> { school });
                return school.ToDetailsDto(clerkUsers, classrooms);
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
                throw new KeyNotFoundException("School not found.");
            
            if (request.SchoolAdminEmails == null)
                throw new ArgumentException("Admin list cannot be null.");


            school.Name = request.SchoolName.Trim();
            school.UpdatedAt = DateTime.UtcNow;

            //ADMINS
            var requestedClerkIds = new List<string>();

            foreach (var email in request.SchoolAdminEmails.Distinct())
            {
                var user = await _clerkService.GetUserByEmailAsync(email);

                if (user == null)
                    throw new KeyNotFoundException($"User with email {email} not found.");

                requestedClerkIds.Add(user.ClerkId);
            }
            var currentAdmins = school.SchoolAdmins.ToList();
            var currentClerkIds = currentAdmins
                .Select(a => a.ClerkId)
                .ToList();

            //REMOVE ADMINS

            var adminsToRemove = currentAdmins
                .Where(a => !requestedClerkIds.Contains(a.ClerkId))
                .ToList();

            foreach (var admin in adminsToRemove)
            {
                school.SchoolAdmins.Remove(admin);
            }

            //ADD NEW ADMINS
            var clerkIdsToAdd = requestedClerkIds
                .Where(id => !currentClerkIds.Contains(id))
                .ToList();

            foreach (var clerkId in clerkIdsToAdd)
            {
                school.SchoolAdmins.Add(new SchoolAdmin
                {
                    SchoolId = school.Id,
                    ClerkId = clerkId
                });
            }

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

        public async Task<List<SchoolClassroomResponseDto>> GetClassroomsForSchoolAsync(int schoolId)
        {
            var classrooms = await _schoolRepository.GetClassroomsBySchoolIdAsync(schoolId);
            return classrooms.Select(c => c.ToClassroomSummaryDto()).ToList();
        }
    }
}
