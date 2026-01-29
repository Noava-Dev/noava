using noava.Models;
using noava.Temp.DTOs.request;
using noava.Temp.DTOs.response;

namespace noava.Temp.Mappers.Classrooms
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

        public static ClassroomResponseDto ToResponseDto(this Classroom entity)
        {
            var dto = new ClassroomResponseDto
            {
                Id = entity.Id,
                Name = entity.Name,
                Description = entity.Description,
                JoinCode = entity.JoinCode,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };

            return dto;
        }

        public static IEnumerable<ClassroomResponseDto> ToResponseDtos(this IEnumerable<Classroom> entities)
        {
            return entities.Select(e => e.ToResponseDto());
        }
    }
}