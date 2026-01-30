using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace noava.Models
{
    public enum InvitationStatus
    {
        Pending = 0,
        Accepted = 1,
        Declined = 2,
        Cancelled = 3
    }

    public class DeckInvitation
    {
        [Key]
        public int InvitationId { get; set; }

        [Required]
        public int DeckId { get; set; }

        [Required]
        public string InvitedByClerkId { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        public string InvitedUserEmail { get; set; } = string.Empty;

        public string? InvitedUserClerkId { get; set; }

        [Required]
        public InvitationStatus Status { get; set; } = InvitationStatus.Pending;

        public DateTime InvitedAt { get; set; }
        public DateTime? RespondedAt { get; set; }

        [ForeignKey("DeckId")]
        public virtual Deck? Deck { get; set; }

        [ForeignKey("InvitedByClerkId")]
        public virtual User? InvitedBy { get; set; }

        [ForeignKey("InvitedUserClerkId")]
        public virtual User? InvitedUser { get; set; }
    }
}