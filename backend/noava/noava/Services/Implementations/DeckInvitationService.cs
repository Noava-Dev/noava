using noava.DTOs.Request;
using noava.DTOs.Request.Notifications;
using noava.DTOs.Response;
using noava.Models;
using noava.Models.Enums;
using noava.Repositories.Contracts;
using noava.Services.Contracts;
using System.Text.Json;

namespace noava.Services.Implementations
{
    public class DeckInvitationService : IDeckInvitationService
    {
        private readonly IDeckInvitationRepository _invitationRepo;
        private readonly IDeckUserRepository _userDeckRepo;
        private readonly IDeckRepository _deckRepo;
        private readonly IUserRepository _userRepo;
        private readonly INotificationService _notificationService;

        public DeckInvitationService(
            IDeckInvitationRepository invitationRepo,
            IDeckUserRepository userDeckRepo,
            IDeckRepository deckRepo,
            IUserRepository userRepo,
            INotificationService notificationService)
        {
            _invitationRepo = invitationRepo;
            _userDeckRepo = userDeckRepo;
            _deckRepo = deckRepo;
            _userRepo = userRepo;
            _notificationService = notificationService;
        }

        public async Task<DeckInvitationResponse> InviteUserAsync(
    int deckId,
    InviteUserRequest request,
    string invitedByClerkId)
        {
            var isOwner = await _userDeckRepo.IsOwnerAsync(deckId, invitedByClerkId);
            if (!isOwner)
                throw new UnauthorizedAccessException("Only deck owners can invite users");

            var deck = await _deckRepo.GetByIdAsync(deckId);
            if (deck == null)
                throw new InvalidOperationException("Deck not found");

            var invitedUser = await _userRepo.GetByClerkIdAsync(request.ClerkId);
            if (invitedUser == null)
                throw new InvalidOperationException("User not found. They must create an account first.");

            var alreadyOwner = await _userDeckRepo.HasAccessAsync(deckId, invitedUser.ClerkId);
            if (alreadyOwner)
                throw new InvalidOperationException("User already has access to this deck");

            // Change: Check for existing invite by ClerkId, not Email
            var existingInvite = await _invitationRepo.ExistsAsync(deckId, invitedUser.ClerkId);
            if (existingInvite)
                throw new InvalidOperationException("User already has a pending invitation");

            var invitation = new DeckInvitation
            {
                DeckId = deckId,
                InvitedByClerkId = invitedByClerkId,
                InvitedUserClerkId = invitedUser.ClerkId,
                Status = InvitationStatus.Pending
            };

            await _invitationRepo.AddAsync(invitation);

          

        var invitedBy = await _userRepo.GetByClerkIdAsync(invitedByClerkId);

 
            var notificationDto = new NotificationRequestDto
            {
                UserId = invitedUser.ClerkId,
                Type = NotificationType.DeckInvitationReceived,
                TemplateKey = "deck_invitation_received",
                ParametersJson = JsonSerializer.Serialize(new
                {
                    deckId = deck.DeckId,
                    deckTitle = deck.Title,
                    invitationId = invitation.InvitationId
                }),
                Link = $"/decks/{deck.DeckId}/invitations/{invitation.InvitationId}",
                Actions = new List<NotificationActionRequestDto>
                {
                    new NotificationActionRequestDto
                    {
                        LabelKey = "accept",  
                        Endpoint = $"/api/deckinvitation/{invitation.InvitationId}/accept",  
                        Method = HttpMethodType.POST  
                    },
                    new NotificationActionRequestDto
                    {
                        LabelKey = "decline",  
                        Endpoint = $"/api/deckinvitation/{invitation.InvitationId}/decline",  
                        Method = HttpMethodType.POST  
                    }
                }
            };

            await _notificationService.CreateNotificationAsync(notificationDto);

            return MapToResponse(invitation, deck);
        }

        public async Task<List<DeckInvitationResponse>> GetInvitationsForDeckAsync(int deckId, string clerkId)
        {
            var isOwner = await _userDeckRepo.IsOwnerAsync(deckId, clerkId);
            if (!isOwner)
                throw new UnauthorizedAccessException("Only deck owners can view invitations");

            var invitations = await _invitationRepo.GetByDeckIdAsync(deckId);
            return invitations.Select(i => MapToResponse(i, i.Deck!)).ToList();
        }

        public async Task<List<DeckInvitationResponse>> GetPendingInvitationsForUserAsync(string clerkId)
        {
            var invitations = await _invitationRepo.GetPendingForUserAsync(clerkId);
            return invitations.Select(i => MapToResponse(i, i.Deck!)).ToList();
        }

        public async Task<DeckInvitationResponse?> AcceptInvitationAsync(int invitationId, string clerkId)
        {
            var invitation = await _invitationRepo.GetByIdAsync(invitationId);
            if (invitation == null) return null;

            if (invitation.InvitedUserClerkId != clerkId)
                throw new UnauthorizedAccessException("This invitation is not for you");

            if (invitation.Status != InvitationStatus.Pending)
                throw new InvalidOperationException("Invitation already responded to");

            invitation.Status = InvitationStatus.Accepted;
            invitation.RespondedAt = DateTime.UtcNow;
            await _invitationRepo.UpdateAsync(invitation);

            var deckUser = new DeckUser
            {
                ClerkId = clerkId,
                DeckId = invitation.DeckId,
                IsOwner = true
            };
            await _userDeckRepo.AddAsync(deckUser);

            var notificationDto = new NotificationRequestDto
            {
                UserId = invitation.InvitedByClerkId,
                Type = NotificationType.DeckInvitationAccepted,
                TemplateKey = "deck_invitation_accepted",
                ParametersJson = JsonSerializer.Serialize(new
                {
                    deckId = invitation.DeckId,
                    deckTitle = invitation.Deck?.Title ?? "Deck",
                }),
                Link = $"/decks/{invitation.DeckId}/cards"
                // No Actions - just an informational notification
            };

            await _notificationService.CreateNotificationAsync(notificationDto);

            return MapToResponse(invitation, invitation.Deck!);
        }

        public async Task<DeckInvitationResponse?> DeclineInvitationAsync(int invitationId, string clerkId)
        {
            var invitation = await _invitationRepo.GetByIdAsync(invitationId);
            if (invitation == null) return null;

            if (invitation.InvitedUserClerkId != clerkId)
                throw new UnauthorizedAccessException("This invitation is not for you");

            if (invitation.Status != InvitationStatus.Pending)
                throw new InvalidOperationException("Invitation already responded to");

            invitation.Status = InvitationStatus.Declined;
            invitation.RespondedAt = DateTime.UtcNow;
            await _invitationRepo.UpdateAsync(invitation);

            // ← UPDATED: No actions needed for decline notification
            var notificationDto = new NotificationRequestDto
            {
                UserId = invitation.InvitedByClerkId,
                Type = NotificationType.DeckInvitationDeclined,
                TemplateKey = "deck_invitation_declined",
                ParametersJson = JsonSerializer.Serialize(new
                {
                    deckId = invitation.DeckId,
                    deckTitle = invitation.Deck?.Title ?? "Deck",
                }),
                Link = $"/decks/{invitation.DeckId}/cards"
                // No Actions - just an informational notification
            };

            await _notificationService.CreateNotificationAsync(notificationDto);

            return MapToResponse(invitation, invitation.Deck!);
        }

        public async Task<bool> CancelInvitationAsync(int invitationId, string clerkId)
        {
            var invitation = await _invitationRepo.GetByIdAsync(invitationId);
            if (invitation == null) return false;

            var isOwner = await _userDeckRepo.IsOwnerAsync(invitation.DeckId, clerkId);
            if (!isOwner)
                throw new UnauthorizedAccessException("Only deck owners can cancel invitations");

            if (invitation.Status != InvitationStatus.Pending)
                throw new InvalidOperationException("Can only cancel pending invitations");

            invitation.Status = InvitationStatus.Cancelled;
            invitation.RespondedAt = DateTime.UtcNow;
            await _invitationRepo.UpdateAsync(invitation);

            return true;
        }

        private DeckInvitationResponse MapToResponse(DeckInvitation invitation, Deck deck)
        {
            return new DeckInvitationResponse
            {
                InvitationId = invitation.InvitationId,
                DeckId = invitation.DeckId,
                DeckTitle = deck?.Title ?? "Unknown",
                InvitedByClerkId = invitation.InvitedByClerkId,
                InvitedUserClerkId = invitation.InvitedUserClerkId,
                Status = invitation.Status,
                InvitedAt = invitation.InvitedAt,
                RespondedAt = invitation.RespondedAt
            };
        }
    }
}