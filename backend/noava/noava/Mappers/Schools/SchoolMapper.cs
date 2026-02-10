using noava.DTOs.Clerk;
using noava.DTOs.Schools;
using noava.Models;

namespace noava.Mappers.Schools
{
    public static class SchoolMapper
    {
        public static SchoolResponseDto ToDetailsDto(this School school, Dictionary<string, ClerkUserResponseDto> clerkUsers)
        {
            return new SchoolResponseDto
            {
                Id = school.Id,
                SchoolName = school.Name,
                CreatedBy = clerkUsers[school.CreatedBy],
                Admins = school.SchoolAdmins.Select(sa => clerkUsers[sa.ClerkId]).ToList(),
                CreatedAt = school.CreatedAt,
                UpdatedAt = school.UpdatedAt,
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
                Name = classroom.Name,
                Description = classroom.Description,
                StudentCount = classroom.ClassroomUsers?.Count ?? 0,
                // Placeholder for now since logic for the decks isn't fully setup yet (i need to wait for brent and youmni)
                DeckCount = 0
            };
        }
    }
}