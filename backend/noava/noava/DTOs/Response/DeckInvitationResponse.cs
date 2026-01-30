using noava.Models;

namespace noava.DTOs.Response
{
    public class DeckInvitationResponse
    {
        public int InvitationId { get; set; }
        public int DeckId { get; set; }
        public string DeckTitle { get; set; } = string.Empty;
        public string InvitedByClerkId { get; set; } = string.Empty;
        public string InvitedByEmail { get; set; } = string.Empty;
        public string InvitedUserEmail { get; set; } = string.Empty;
        public string? InvitedUserClerkId { get; set; }
        public InvitationStatus Status { get; set; }
        public DateTime InvitedAt { get; set; }
        public DateTime? RespondedAt { get; set; }
    }
}