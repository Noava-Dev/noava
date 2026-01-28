using noava.Models;
using noava.DTOs.Request;
using noava.DTOs.Response;
using noava.Services.Interfaces;
using noava.Repositories.Contracts;
using noava.Repositories.Interfaces;

namespace noava.Services
{
    public class CardService : ICardService
    {
        private readonly ICardRepository _cardRepository;
        private readonly IDeckRepository _deckRepository;

        public CardService(ICardRepository cardRepository, IDeckRepository deckRepository)
        {
            _cardRepository = cardRepository;
            _deckRepository = deckRepository;
        }

        private CardResponse MapToResponse(Card card)
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
                UpdatedAt = card.UpdatedAt
            };
        }

        public async Task<List<CardResponse>> GetCardsByDeckIdAsync(int deckId, string userId)
        {
            var deck = await _deckRepository.GetByIdAsync(deckId);
            if (deck == null || deck.UserId != userId)
                return new List<CardResponse>();

            var cards = await _cardRepository.GetByDeckIdAsync(deckId);
            return cards.Select(c => MapToResponse(c)).ToList();
        }

        public async Task<CardResponse?> GetCardByIdAsync(int id, string userId)
        {
            var card = await _cardRepository.GetByIdAsync(id);
            if (card == null) return null;

            var deck = await _deckRepository.GetByIdAsync(card.DeckId);
            if (deck == null || deck.UserId != userId) return null;

            return MapToResponse(card);
        }

        public async Task<CardResponse> CreateCardAsync(int deckId, CardRequest request, string userId)
        {
            var deck = await _deckRepository.GetByIdAsync(deckId);
            if (deck == null || deck.UserId != userId)
                throw new UnauthorizedAccessException("Not authorized to add cards to this deck");

            var card = new Card
            {
                DeckId = deckId,
                FrontText = request.FrontText,
                BackText = request.BackText,
                FrontImage = request.FrontImage,
                FrontAudio = request.FrontAudio,
                BackImage = request.BackImage,
                BackAudio = request.BackAudio,
                Memo = request.Memo
            };

            var createdCard = await _cardRepository.CreateAsync(card);
            return MapToResponse(createdCard);
        }

        public async Task<CardResponse?> UpdateCardAsync(int id, CardRequest request, string userId)
        {
            var existingCard = await _cardRepository.GetByIdAsync(id);
            if (existingCard == null) return null;

            var deck = await _deckRepository.GetByIdAsync(existingCard.DeckId);
            if (deck == null || deck.UserId != userId) return null;

            existingCard.FrontText = request.FrontText;
            existingCard.BackText = request.BackText;
            existingCard.FrontImage = request.FrontImage;
            existingCard.FrontAudio = request.FrontAudio;
            existingCard.BackImage = request.BackImage;
            existingCard.BackAudio = request.BackAudio;
            existingCard.Memo = request.Memo;

            var updatedCard = await _cardRepository.UpdateAsync(existingCard);
            return MapToResponse(updatedCard);
        }

        public async Task<bool> DeleteCardAsync(int id, string userId)
        {
            var card = await _cardRepository.GetByIdAsync(id);
            if (card == null) return false;

            var deck = await _deckRepository.GetByIdAsync(card.DeckId);
            if (deck == null || deck.UserId != userId) return false;

            return await _cardRepository.DeleteAsync(id);
        }
    }
}