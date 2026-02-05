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
    }
}