using noava.DTOs.Cards;
using noava.Models;

namespace noava.Mappers.Cards
{
    public static class CardMapper
    {
        // Entity => Response DTO
        public static CardResponse ToResponse(Card card)
        {
            return new CardResponse
            {
                CardId = card.Id,
                DeckId = card.DeckId,
                FrontText = card.FrontText,
                BackText = card.BackText,
                FrontImage = card.FrontImage,
                FrontAudio = card.FrontAudio,
                BackImage = card.BackImage,
                BackAudio = card.BackAudio,
                Memo = card.Memo,
                CreatedAt = card.CreatedAt,
                UpdatedAt = card.UpdatedAt,
                HasVoiceAssistant = card.HasVoiceAssistant
            };
        }

        // Request DTO => Entity
        public static Card ToEntity(CardRequest request, int deckId)
        {
            return new Card
            {
                DeckId = deckId,
                FrontText = request.FrontText,
                BackText = request.BackText,
                FrontImage = request.FrontImage,
                FrontAudio = request.FrontAudio,
                BackImage = request.BackImage,
                BackAudio = request.BackAudio,
                Memo = request.Memo,
                HasVoiceAssistant = request.HasVoiceAssistant
            };
        }

        // CSV DTO => Entity
        public static Card FromCsvDto(CardCsvImportDto dto, int deckId)
        {
            return new Card
            {
                DeckId = deckId,
                FrontText = dto.FrontText,
                BackText = dto.BackText,
                Memo = dto.Memo
            };
        }
    }
}
