namespace noava.Models.Enums
{
    public enum NotificationType
    {
        ClassroomInvitationReceived,
        ClassroomInvitationAccepted,
        ClassroomInvitationDenied,
        DeckSharedWithYou,
        DeckUpdated,
        DeckCommentAdded,
        DeckStudyReminder,
        SystemAlert,
        SystemMaintenance,
        DeckInvitationReceived, // When someone invites you to co-own a deck
        DeckInvitationAccepted, // When someone accepts your invitation
        DeckInvitationDeclined,// When someone declines your invitation
        DeckOwnershipGranted, // When you become a deck owner
        DeckOwnershipRevoked // When your ownership is removed
    }
}