using noava.DTOs.Decks;
using noava.Mappers.Decks;
using noava.Models;
using noava.Models.BlobStorage;
using noava.Models.Enums;
using noava.Repositories;
using noava.Repositories.Decks;
using noava.Services.Decks;
using noava.Shared;

namespace noava.Services
{
    public class DeckService : IDeckService
    {
        private readonly IDeckRepository _repository;
        IDeckUserRepository _deckUserRepo;
        private readonly IBlobService _blobService;

        public DeckService(IDeckRepository repository, IBlobService blobService, IDeckUserRepository deckUserRepo)
        {
            _repository = repository;
            _blobService = blobService;
            _deckUserRepo = deckUserRepo;
        }

        private bool IsValidBlobName(string? blobName)
        {
            if (string.IsNullOrEmpty(blobName))
                return true;


            var parts = blobName.Split('_', 2);
            if (parts.Length != 2) return false;

            return Guid.TryParse(parts[0], out _);
        }


        public async Task<List<DeckResponse>> GetAllDecksAsync()
        {
            var decks = await _repository.GetAllAsync();
            return decks.Select(d => d.ToResponseDto()).ToList();
        }


        public async Task<List<DeckResponse>> GetUserDecksAsync(string userId, int? limit = null)
        {
            var decks = await _repository.GetByUserIdAsync(userId, limit);
            return decks.Select(d => d.ToResponseDto()).ToList();
        }

        public async Task<DeckResponse?> GetDeckByIdAsync(int id)
        {
            var deck = await _repository.GetByIdAsync(id);
            if (deck == null) return null;
            return deck.ToResponseDto();
        }

        public async Task<DeckResponse> CreateDeckAsync(DeckRequest request, string userId)
        {
            
            if (!IsValidBlobName(request.CoverImageBlobName))
            {
                throw new ArgumentException("Invalid cover image blob name format.");
            }

            var deck = new Deck
            {
                Title = request.Title,
                Description = request.Description,
                Language = request.Language,
                Visibility = request.Visibility,
                CoverImageBlobName = request.CoverImageBlobName,
                UserId = userId,
            };

            var createdDeck = await _repository.CreateAsync(deck);

            var deckUser = new DeckUser
            {
                ClerkId = userId,
                DeckId = createdDeck.DeckId,
                IsOwner = true,
                AddedAt = DateTime.UtcNow
            };

            await _deckUserRepo.AddAsync(deckUser);

            return createdDeck.ToResponseDto();
        }

        public async Task<DeckResponse?> UpdateDeckAsync(int id, DeckRequest request, string userId)
        {
            var existingDeck = await _repository.GetByIdAsync(id);
            if (existingDeck == null) return null;


            var isOwner = await _deckUserRepo.IsOwnerAsync(id, userId);
            var isCreator = existingDeck.UserId == userId;

            if (!isOwner && !isCreator)
                return null;


            if (!IsValidBlobName(request.CoverImageBlobName))
            {
                throw new ArgumentException("Invalid cover image blob name format.");
            }

            var oldImageBlobName = existingDeck.CoverImageBlobName;
            var newImageBlobName = request.CoverImageBlobName;
            bool imageChanged = oldImageBlobName != newImageBlobName;

            existingDeck.Title = request.Title;
            existingDeck.Description = request.Description;
            existingDeck.Language = request.Language;
            existingDeck.Visibility = request.Visibility;
            existingDeck.CoverImageBlobName = newImageBlobName;
            existingDeck.UpdatedAt = DateTime.UtcNow;

            var result = await _repository.UpdateAsync(existingDeck);

            if (imageChanged && !string.IsNullOrEmpty(oldImageBlobName))
            {
                try
                {
                    await _blobService.DeleteFile(new DeleteFileRequest
                    {
                        ContainerName = "deck-images",
                        BlobName = oldImageBlobName
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete old image: {ex.Message}");
                }
            }

            return result.ToResponseDto();
        }

        public async Task<bool> DeleteDeckAsync(int id, string userId)
        {
            var deck = await _repository.GetByIdAsync(id);
            if (deck == null) return false;

            if (deck.UserId != userId) return false;

            var result = await _repository.DeleteAsync(id);

            // Delete image from blob storage if exists
            if (result && !string.IsNullOrEmpty(deck.CoverImageBlobName))
            {
                try
                {
                    await _blobService.DeleteFile(new DeleteFileRequest
                    {
                        ContainerName = "deck-images",
                        BlobName = deck.CoverImageBlobName
                    });
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Failed to delete deck image: {ex.Message}");
                }
            }

            return result;
        }

        public async Task<bool> CanUserViewDeckAsync(int deckId, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId);
            if (deck == null)
                return false;

            if (deck.Visibility == DeckVisibility.Public)
                return true;

            if (deck.UserId == userId)
                return true;

            return await _repository
                .IsUserLinkedToDeckAsync(deckId, userId);
        }

        public async Task<Deck?> GetDeckIfUserCanViewAsync(int deckId, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId);
            if (deck == null)
                return null;

            if (deck.Visibility == DeckVisibility.Public || deck.UserId == userId ||
                await _repository.IsUserLinkedToDeckAsync(deckId, userId))
            {
                return deck;
            }

            return null;
        }

        public async Task<List<DeckResponse>> GetDeckByIdsAsync(IEnumerable<int> ids, string userId)
        {
            var decks = await _repository.GetByIdsAsync(ids);
            var authorizedDecks = new List<Deck>();

            foreach (var deck in decks)
            {
                bool cond = await _repository.IsUserLinkedToDeckAsync(deck.DeckId, userId);
                if (cond)
                {
                    authorizedDecks.Add(deck);
                }
            }

            return authorizedDecks.ToResponseDtoList();
        }
    }
}