using noava.DTOs.Cards;
using noava.Models;
using noava.Models.BlobStorage;
using noava.Models.Enums;
using noava.Repositories.Cards;
using noava.Repositories.Decks;
using noava.Services.Cards.BulkReview;
using noava.Shared;
using noava.Mappers.Cards;

namespace noava.Services.Cards
{
    public class CardService : ICardService
    {
        private readonly ICardRepository _cardRepository;
        private readonly IDeckRepository _deckRepository;
        private readonly IDeckUserRepository _deckUserRepository;  
        private readonly IBlobService _blobService;

        public CardService(
            ICardRepository cardRepository,
            IDeckRepository deckRepository,
            IDeckUserRepository deckUserRepository,  
            IBlobService blobService)
        {
            _cardRepository = cardRepository;
            _deckRepository = deckRepository;
            _deckUserRepository = deckUserRepository;  
            _blobService = blobService;
        }

        private async Task<bool> CanUserViewDeckAsync(int deckId, string userId)
        {
            var deck = await _deckRepository.GetByIdAsync(deckId);
            if (deck == null) return false;

            // Creator can always view
            if (deck.UserId == userId) return true;

            // Check if user has access via DeckUsers (owner OR invited)
            return await _deckUserRepository.HasAccessAsync(deckId, userId);
        }

    
        private async Task<bool> CanUserEditDeckAsync(int deckId, string userId)
        {
            var deck = await _deckRepository.GetByIdAsync(deckId);
            if (deck == null) return false;

            // Creator can always edit
            if (deck.UserId == userId) return true;

            // Check if user is owner (not just invited)
            return await _deckUserRepository.IsOwnerAsync(deckId, userId);
        }


        public async Task<List<CardResponse>> GetCardsByDeckIdAsync(int deckId, string userId)
        {
            // Check if user can view deck (creator, owner, OR invited)
            if (!await CanUserViewDeckAsync(deckId, userId))
                return new List<CardResponse>();

            var cards = await _cardRepository.GetByDeckIdAsync(deckId);
            return cards.Select(CardMapper.ToResponse).ToList();
        }


        public async Task<List<CardResponse>> GetBulkReviewCardsAsync(
            List<int> deckIds,
            string userId,
            BulkReviewMode mode)
        {
            var result = new List<Card>();
            var strategy = ResolveBulkReviewStrategy(mode);

            foreach (var deckId in deckIds)
            {
                // Check if user can view deck (creator, owner, OR invited)
                if (!await CanUserViewDeckAsync(deckId, userId))
                    continue;

                var cards = await _cardRepository.GetByDeckIdAsync(deckId);
                cards = strategy.ApplyPerDeck(cards);

                result.AddRange(cards);
            }

            result = strategy.ApplyGlobal(result);

            return result.Select(CardMapper.ToResponse).ToList();
        }

        public async Task<CardResponse?> GetCardByIdAsync(int id, string userId)
        {
            var card = await _cardRepository.GetByIdAsync(id);
            if (card == null) return null;

            // Check if user can view deck (creator, owner, OR invited)
            if (!await CanUserViewDeckAsync(card.DeckId, userId))
                return null;

            return CardMapper.ToResponse(card);
        }


        public async Task<CardResponse> CreateCardAsync(int deckId, CardRequest request, string userId)
        {
            // Check if user can edit deck (creator OR owner, NOT invited)
            if (!await CanUserEditDeckAsync(deckId, userId))
                throw new UnauthorizedAccessException("Not authorized to add cards to this deck");

            var card = CardMapper.ToEntity(request, deckId);

            var createdCard = await _cardRepository.CreateAsync(card);
            return CardMapper.ToResponse(createdCard);
        }


        public async Task<CardResponse?> UpdateCardAsync(int id, CardRequest request, string userId)
        {
            var existingCard = await _cardRepository.GetByIdAsync(id);
            if (existingCard == null) return null;

            // Check if user can edit deck (creator OR owner, NOT invited)
            if (!await CanUserEditDeckAsync(existingCard.DeckId, userId))
                return null;

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

            return CardMapper.ToResponse(updatedCard);
        }

        public async Task<bool> DeleteCardAsync(int id, string userId)
        {
            var card = await _cardRepository.GetByIdAsync(id);
            if (card == null) return false;

            // Check if user can edit deck (creator OR owner, NOT invited)
            if (!await CanUserEditDeckAsync(card.DeckId, userId))
                return false;

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

        private List<T> Shuffle<T>(IEnumerable<T> source)
        {
            var list = source.ToList();

            for (int i = list.Count - 1; i > 0; i--)
            {
                int j = Random.Shared.Next(i + 1);
                (list[i], list[j]) = (list[j], list[i]);
            }

            return list;
        }

        private IBulkReviewStrategy ResolveBulkReviewStrategy(BulkReviewMode mode)
        {
            return mode switch
            {
                BulkReviewMode.ShufflePerDeck =>
                    new ShufflePerDeckStrategy(Shuffle),

                BulkReviewMode.ShuffleAll =>
                    new ShuffleAllStrategy(Shuffle),

                _ => new BulkReviewStrategy()
            };
        }
    }
}