using noava.DTOs.Decks;
using noava.DTOs.Notifications;
using noava.DTOs.Clerk;
using noava.Mappers.Decks;
using noava.Models;
using noava.Models.BlobStorage;
using noava.Models.Enums;
using noava.Repositories;
using noava.Repositories.Decks;
using noava.Services.Decks;
using noava.Services.Notifications;
using noava.Shared;
using System.Security.Cryptography;
using System.Text.Json;
using noava.Data;
using Microsoft.EntityFrameworkCore;

namespace noava.Services
{
    public class DeckService : IDeckService
    {
        private readonly IDeckRepository _repository;
        private readonly IDeckUserRepository _deckUserRepo;
        private readonly IBlobService _blobService;
        private readonly IClerkService _clerkService;
        private readonly INotificationService _notificationService;
        private readonly NoavaDbContext _context;

        public DeckService(
            IDeckRepository repository,
            IBlobService blobService,
            IDeckUserRepository deckUserRepo,
            IClerkService clerkService,
            INotificationService notificationService,
            NoavaDbContext context)
        {
            _repository = repository;
            _blobService = blobService;
            _deckUserRepo = deckUserRepo;
            _clerkService = clerkService;
            _notificationService = notificationService;
            _context = context;
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
            var query = _context.Decks
                .Where(d =>
                    // User created the deck
                    d.UserId == userId ||
                    // OR user has access via DeckUsers (owner OR invited)
                    d.DeckUsers.Any(du => du.ClerkId == userId))
                .OrderByDescending(d => d.CreatedAt)
                .AsQueryable();

            if (limit.HasValue)
            {
                query = query.Take(limit.Value);
            }

            return await query
                .Select(d => new DeckResponse
                {
                    DeckId = d.DeckId,
                    UserId = d.UserId,
                    Title = d.Title,
                    Description = d.Description,
                    Language = d.Language,
                    Visibility = d.Visibility,
                    CoverImageBlobName = d.CoverImageBlobName,
                    JoinCode = d.JoinCode,
                    CreatedAt = d.CreatedAt,
                    UpdatedAt = d.UpdatedAt
                })
                .ToListAsync();
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
                JoinCode = GenerateJoinCode()
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

            // Only allow delete if user is owner
            var isOwner = await _deckUserRepo.IsOwnerAsync(id, userId);
            if (!isOwner) return false;

            var result = await _repository.DeleteAsync(id);

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

            return await _deckUserRepo.HasAccessAsync(deckId, userId);
        }

        public async Task<Deck?> GetDeckIfUserCanViewAsync(int deckId, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId);
            if (deck == null)
                return null;

            if (deck.Visibility == DeckVisibility.Public || deck.UserId == userId ||
                await _deckUserRepo.HasAccessAsync(deckId, userId))
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
                bool cond = await _deckUserRepo.HasAccessAsync(deck.DeckId, userId);
                if (cond)
                {
                    authorizedDecks.Add(deck);
                }
            }

            return authorizedDecks.ToResponseDtoList();
        }

        public async Task<DeckResponse> InviteUserByEmailAsync(int deckId, string userId, string email, bool isOwner)  // ← ADD isOwner
        {
            var deck = await _repository.GetByIdAsync(deckId)
                ?? throw new KeyNotFoundException("Deck not found.");

            // Check if user is creator
            if (deck.UserId != userId)
                throw new UnauthorizedAccessException("Only the deck creator can invite users.");

            // Get invited user from Clerk
            var invitedUser = await _clerkService.GetUserByEmailAsync(email)
                ?? throw new KeyNotFoundException("User with this email not found.");

            // Check if user is already a member
            var existingMember = await _deckUserRepo.GetByDeckAndUserAsync(deckId, invitedUser.ClerkId);
            if (existingMember != null)
            {
                // Update their owner status if different
                if (existingMember.IsOwner != isOwner)
                {
                    existingMember.IsOwner = isOwner;
                    await _context.SaveChangesAsync();
                }
                return deck.ToResponseDto();
            }

            // Get owner info
            var owner = await _clerkService.GetUserAsync(userId)
                ?? throw new KeyNotFoundException("Inviting user not found.");

            var ownerFullName = $"{owner.FirstName} {owner.LastName}".Trim();

            // Create notification parameters
            var parametersJson = JsonSerializer.Serialize(new
            {
                deckTitle = deck.Title,
                ownerName = ownerFullName,
                isOwner = isOwner  // ← ADD: Include in notification
            });

            // Send notification with join link
            var notification = new NotificationRequestDto
            {
                Type = NotificationType.DeckInvitationReceived,
                TemplateKey = "notifications.items.deck.invite.received",
                UserId = invitedUser.ClerkId,
                ParametersJson = parametersJson,
                Actions = new List<NotificationActionRequestDto>
        {
            new NotificationActionRequestDto
            {
                LabelKey = "notifications.items.deck.invite.actions.accept",
                Endpoint = $"/deck/join/{deck.JoinCode}?isOwner={isOwner}",  // ← ADD: Pass isOwner in URL
                Method = HttpMethodType.POST
            }
        }
            };

            await _notificationService.CreateNotificationAsync(notification);

            return deck.ToResponseDto();
        }

        public async Task<DeckResponse> JoinByJoinCodeAsync(string joinCode, string userId, bool isOwner = false)  // ← ADD isOwner
        {
           

            var deck = await _repository.GetByJoinCodeAsync(joinCode);

            if (deck == null)
            {
                throw new KeyNotFoundException("Invalid join code.");
            }


            // Check if already has access
            var existingMember = await _deckUserRepo.GetByDeckAndUserAsync(deck.DeckId, userId);

            if (existingMember != null)
            {


                // Update owner status if different
                if (existingMember.IsOwner != isOwner)
                {
                    existingMember.IsOwner = isOwner;
                    await _context.SaveChangesAsync();

                }
            }
            else
            {

                var deckUser = new DeckUser
                {
                    ClerkId = userId,
                    DeckId = deck.DeckId,
                    IsOwner = isOwner,  // ← USE the parameter
                    AddedAt = DateTime.UtcNow
                };

                await _deckUserRepo.AddAsync(deckUser);

            }

            return deck.ToResponseDto();
        }

        public async Task<DeckResponse> UpdateJoinCodeAsync(int deckId, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId)
                ?? throw new KeyNotFoundException("Deck not found.");


            if (deck.UserId != userId)
                throw new UnauthorizedAccessException("Only the deck creator can update the join code.");

            deck.JoinCode = GenerateJoinCode();
            deck.UpdatedAt = DateTime.UtcNow;

            await _repository.UpdateAsync(deck);

            return deck.ToResponseDto();
        }

        private static string GenerateJoinCode()
        {
            var guidBytes = Guid.NewGuid().ToByteArray();
            var randomBytes = RandomNumberGenerator.GetBytes(8);

            var combined = guidBytes.Concat(randomBytes).ToArray();

            return Convert.ToBase64String(combined)
                .TrimEnd('=')
                .Replace('+', '-')
                .Replace('/', '_');
        }

        public async Task<IEnumerable<ClerkUserResponseDto>> GetAllUsersByDeckAsync(int deckId, int page, int pageSize, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId);
            if (deck == null)
                throw new KeyNotFoundException("Deck not found.");

            // Only deck creator or users with access can view users
            var hasAccess = await _deckUserRepo.HasAccessAsync(deckId, userId);
            if (!hasAccess && deck.UserId != userId)
                throw new UnauthorizedAccessException("You don't have access to this deck.");

            // Get all users for this deck
            var userIds = (await _deckUserRepo.GetByDeckIdAsync(deckId))
                .Select(du => du.ClerkId)
                .Distinct()
                .ToList();

            if (!userIds.Any())
                return Enumerable.Empty<ClerkUserResponseDto>();

            var pagedUserIds = userIds
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            var clerkUsers = await _clerkService.GetUsersAsync(pagedUserIds);

            // Mark owners
            var ownerLookup = (await _deckUserRepo.GetByDeckIdAsync(deckId))
                .Where(du => du.IsOwner)
                .ToDictionary(du => du.ClerkId, du => true);

            foreach (var user in clerkUsers)
            {
                user.IsOwner = ownerLookup.ContainsKey(user.ClerkId);
            }

            return clerkUsers;
        }


        public async Task<DeckResponse> RemoveOwnerAsync(int deckId, string targetUserId, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId)
                ?? throw new KeyNotFoundException("Deck not found.");

            //Only deck creator can remove users
            if (deck.UserId != userId)
                throw new UnauthorizedAccessException("Only the deck creator can remove users.");

            // Don't allow removing the creator
            if (deck.UserId == targetUserId)
                throw new InvalidOperationException("Cannot remove the deck creator.");

            // Remove the user
            var deckUser = await _deckUserRepo.GetByDeckAndUserAsync(deckId, targetUserId);
            if (deckUser != null)
            {
                await _deckUserRepo.RemoveAsync(deckUser);
            }

            return deck.ToResponseDto();
        }

        public async Task<DeckResponse> RemoveUserAsync(int deckId, string targetUserId, string userId)
        {
            var deck = await _repository.GetByIdAsync(deckId)
                ?? throw new KeyNotFoundException("Deck not found.");

     
            var isCreator = deck.UserId == userId;
            var isOwner = await _deckUserRepo.IsOwnerAsync(deckId, userId);

            if (!isCreator && !isOwner)
                throw new UnauthorizedAccessException("Only the deck creator or owners can remove users.");

            if (deck.UserId == targetUserId)
                throw new InvalidOperationException("Cannot remove the deck creator.");


            var targetIsOwner = await _deckUserRepo.IsOwnerAsync(deckId, targetUserId);
            if (targetIsOwner && !isCreator)
                throw new UnauthorizedAccessException("Only the deck creator can remove owners.");

            // Remove the user
            var deckUser = await _deckUserRepo.GetByDeckAndUserAsync(deckId, targetUserId);
            if (deckUser != null)
            {
                await _deckUserRepo.RemoveAsync(deckUser);
            }

            return deck.ToResponseDto();
        }






    }
   }

