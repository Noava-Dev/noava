using noava.DTOs.ContactMessages;
using noava.Models;

namespace noava.Mappers.ContactMessages
{
    public static class ContactMessageMapper
    {
        public static ContactMessage ToEntity(this ContactMessageRequest dto)
        {
            return new ContactMessage
            {
                Title = dto.Title,
                SenderEmail = dto.SenderEmail,
                Subject = dto.Subject,
                Description = dto.Description,
                CreatedAt = DateTime.UtcNow
            };
        }

        public static ContactMessageResponse ToResponseDto(this ContactMessage entity)
        {
            return new ContactMessageResponse
            {
                Id = entity.Id,
                Title = entity.Title,
                SenderEmail = entity.SenderEmail,
                Subject = entity.Subject,
                Description = entity.Description,
                Status = entity.Status,
                CreatedAt = entity.CreatedAt
            };
        }

        public static IEnumerable<ContactMessageResponse> ToResponseDtos(this IEnumerable<ContactMessage> entities)
        {
            return entities.Select(e => e.ToResponseDto());
        }
    }
}