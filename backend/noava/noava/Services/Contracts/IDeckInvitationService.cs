using noava.DTOs.Request;
using noava.DTOs.Response;

namespace noava.Services.Contracts
{
    public interface IDeckInvitationService
    {
        Task<DeckInvitationResponse> InviteUserAsync(int deckId, InviteUserRequest request, string invitedByClerkId);
        Task<List<DeckInvitationResponse>> GetInvitationsForDeckAsync(int deckId, string clerkId);
        Task<List<DeckInvitationResponse>> GetPendingInvitationsForUserAsync(string clerkId);
        Task<DeckInvitationResponse?> AcceptInvitationAsync(int invitationId, string clerkId);
        Task<DeckInvitationResponse?> DeclineInvitationAsync(int invitationId, string clerkId);
        Task<bool> CancelInvitationAsync(int invitationId, string clerkId);
    }
}