export const InvitationStatus = {
  Pending: 0,
  Accepted: 1,
  Declined: 2,
  Cancelled: 3
} as const;

export type InvitationStatus = typeof InvitationStatus[keyof typeof InvitationStatus];

export interface DeckInvitation {
  invitationId: number;
  deckId: number;
  deckTitle: string;
  invitedByClerkId: string;
  invitedByEmail: string;
  invitedUserEmail: string;
  invitedUserClerkId?: string;
  status: InvitationStatus;
  invitedAt: string;
  respondedAt?: string;
}