using noava.DTOs.Schools;
using noava.Models;

namespace noava.Mappers.Schools
{
    public static class SchoolMapper
    {
        public static SchoolDetailsDto ToDetailsDto(School school)
        {
            return new SchoolDetailsDto
            {
                Id = school.Id,
                SchoolName = school.Name,
                CreatedAt = school.CreatedAt,
                UpdatedAt = school.UpdatedAt,
                //AdminUserIds = school.SchoolAdmins
                /// i need a user DTO that will return the user email and full name

            };
        }
    }
}
