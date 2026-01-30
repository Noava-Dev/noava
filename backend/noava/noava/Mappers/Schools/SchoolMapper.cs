using noava.DTOs.Schools;
using noava.Models;

namespace noava.Mappers.Schools
{
    public static class SchoolMapper
    {
        public static SchoolDetailsDto ToDetailsDto(School school, List<UserSummaryDto> admins)
        {
            return new SchoolDetailsDto
            {
                Id = school.Id,
                SchoolName = school.Name,
                CreatedAt = school.CreatedAt,
                UpdatedAt = school.UpdatedAt,
                Admins = admins

            };
        }
    }
}