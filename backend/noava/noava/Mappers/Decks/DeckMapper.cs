using noava.DTOs.Decks;
using noava.Models;

namespace noava.Mappers.Decks
{
    public static class DeckMapper
    {
        public static DeckResponse ToResponseDto(this Deck action)
        {
            return new DeckResponse
            {
                DeckId = action.DeckId,
                UserId = action.UserId,
                Title = action.Title,
                Description = action.Description,
                Language = action.Language,
                Visibility = action.Visibility,
                CoverImageBlobName = action.CoverImageBlobName,
                CreatedAt = action.CreatedAt,
                UpdatedAt = action.UpdatedAt
            };
        }

        public static Deck ToEntity(this DeckResponse dto)
        {
            return new Deck
            {
                DeckId = dto.DeckId,
                UserId = dto.UserId,
                Title = dto.Title,
                Description = dto.Description,
                Language = dto.Language,
                Visibility = dto.Visibility,
                CoverImageBlobName = dto.CoverImageBlobName,
                CreatedAt = dto.CreatedAt,
                UpdatedAt = dto.UpdatedAt
            };
        }
    }
}
