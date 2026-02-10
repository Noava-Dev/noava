using noava.Shared;
using noava.Models.BlobStorage;
using noava.Repositories.Decks;
using noava.DTOs.Cards;
using noava.Models;
using noava.Repositories.Cards;

namespace noava.Services.Cards
{
    public class CardService : ICardService
    {
        private readonly ICardRepository _cardRepository;
        private readonly IDeckRepository _deckRepository;
        private readonly IBlobService _blobService;  
        public CardService(
            ICardRepository cardRepository,
            IDeckRepository deckRepository,
            IBlobService blobService)  
        {
            _cardRepository = cardRepository;
            _deckRepository = deckRepository;
            _blobService = blobService;  
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
                UpdatedAt = card.UpdatedAt,
                HasVoiceAssistant = card.HasVoiceAssistant
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
                Memo = request.Memo,
                HasVoiceAssistant = request.HasVoiceAssistant
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

            var oldFrontImage = existingCard.FrontImage;
            var oldFrontAudio = existingCard.FrontAudio;
            var oldBackImage = existingCard.BackImage;
            var oldBackAudio = existingCard.BackAudio;
            

            var newFrontImage = request.FrontImage;
            var newFrontAudio = request.FrontAudio;
            var newBackImage = request.BackImage;
            var newBackAudio = request.BackAudio;

            // Update card
            existingCard.FrontText = request.FrontText;
            existingCard.BackText = request.BackText;
            existingCard.FrontImage = newFrontImage;
            existingCard.FrontAudio = newFrontAudio;
            existingCard.BackImage = newBackImage;
            existingCard.BackAudio = newBackAudio;
            existingCard.Memo = request.Memo;
            existingCard.HasVoiceAssistant = request.HasVoiceAssistant;

            var updatedCard = await _cardRepository.UpdateAsync(existingCard);


            await CleanupOldBlobs(oldFrontImage, newFrontImage, "card-images");
            await CleanupOldBlobs(oldFrontAudio, newFrontAudio, "card-audio");
            await CleanupOldBlobs(oldBackImage, newBackImage, "card-images");
            await CleanupOldBlobs(oldBackAudio, newBackAudio, "card-audio");

            return MapToResponse(updatedCard);
        }

        public async Task<bool> DeleteCardAsync(int id, string userId)
        {
            var card = await _cardRepository.GetByIdAsync(id);
            if (card == null) return false;

            var deck = await _deckRepository.GetByIdAsync(card.DeckId);
            if (deck == null || deck.UserId != userId) return false;

            var result = await _cardRepository.DeleteAsync(id);

            if (result)
            {
                await DeleteBlobIfExists(card.FrontImage, "card-images");
                await DeleteBlobIfExists(card.FrontAudio, "card-audio");
                await DeleteBlobIfExists(card.BackImage, "card-images");
                await DeleteBlobIfExists(card.BackAudio, "card-audio");
            }

            return result;
        }


        private async Task CleanupOldBlobs(string? oldBlobName, string? newBlobName, string containerName)
        {
            // Only delete if blob changed and old blob exists
            if (!string.IsNullOrEmpty(oldBlobName) && oldBlobName != newBlobName)
            {
                await DeleteBlobIfExists(oldBlobName, containerName);
            }
        }


        private async Task DeleteBlobIfExists(string? blobName, string containerName)
        {
            if (string.IsNullOrEmpty(blobName)) return;
            await _blobService.DeleteFile(new DeleteFileRequest
            {
                ContainerName = containerName,
                BlobName = blobName
            });



        }
    } 
}