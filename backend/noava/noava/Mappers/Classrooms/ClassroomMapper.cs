using noava.DTOs.Request.Classrooms;
using noava.DTOs.Response.Classrooms;
using noava.Models;

namespace noava.Mappers.Classrooms
{
    public static class ClassroomMapper
    {
        public static Classroom ToEntity(this ClassroomRequestDto dto)
        {
            var entity = new Classroom
            {
                Name = dto.Name,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            return entity;
        }

        public static ClassroomResponseDto ToResponseDto(this Classroom entity, string userId)
        {

            var isTeacher = entity.ClassroomUsers
                .Any(cu => cu.UserId == userId && cu.IsTeacher);

            var dto = new ClassroomResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                JoinCode = entity.JoinCode,
                Permissions = new ClassroomPermissionsDto
                {
                    CanEdit = isTeacher,
                    CanDelete = isTeacher
                },
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };

            return dto;
        }

        public static IEnumerable<ClassroomResponseDto> ToResponseDtos(this IEnumerable<Classroom> entities, string userId)
        {
            return entities.Select(e => e.ToResponseDto(userId));
        }
    }
}