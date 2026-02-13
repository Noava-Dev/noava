using noava.DTOs.Clerk;
using noava.DTOs.Schools;
using noava.Models;

namespace noava.Mappers.Schools
{
    public static class SchoolMapper
    {
        public static SchoolResponseDto ToDetailsDto(this School school, Dictionary<string, ClerkUserResponseDto> clerkUsers, List<Classroom> classrooms)
        {
            return new SchoolResponseDto
            {
                Id = school.Id,
                SchoolName = school.Name,
                CreatedBy = clerkUsers[school.CreatedBy],
                Admins = school.SchoolAdmins.Select(sa => clerkUsers[sa.ClerkId]).ToList(),
                CreatedAt = school.CreatedAt,
                UpdatedAt = school.UpdatedAt,
                TotalStudents = classrooms
                    .SelectMany(c => c.ClassroomUsers)
                    .Where(cu => !cu.IsTeacher)
                    .Select(cu => cu.UserId)
                    .Distinct()
                    .Count(),
                TotalDecks = classrooms
                    .SelectMany(c => c.ClassroomDecks)
                    .Select(cd => cd.DeckId)
                    .Count()
            };
        }

        public static School ToEntity(this SchoolRequestDto dto, List<SchoolAdmin> schoolAdmins)
        {
            return new School
            {
                Name = dto.SchoolName,
                CreatedBy = dto.CreatedBy,
                SchoolAdmins = schoolAdmins,
            };
        }

        public static SchoolClassroomResponseDto ToClassroomSummaryDto(this Classroom classroom)
        {
            return new SchoolClassroomResponseDto
            {
                ClassroomId = classroom.Id,
                Name = classroom.Name,
                Description = classroom.Description,
                StudentCount = classroom.ClassroomUsers.Count(cu => !cu.IsTeacher),
                DeckCount = classroom.ClassroomDecks.Count
            };
        }
    }
}