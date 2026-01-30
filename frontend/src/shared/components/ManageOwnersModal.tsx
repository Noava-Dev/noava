import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, Button, Badge, Spinner } from 'flowbite-react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { HiUserGroup, HiTrash, HiX, HiUserAdd, HiClock } from 'react-icons/hi';
import { deckOwnershipService } from '../../services/DeckOwnershipService';
import { deckInvitationService } from '../../services/DeckInvitationService';
import type { DeckOwner } from '../../models/DeckOwner';
import { InvitationStatus, type DeckInvitation } from '../../models/DeckInvitation';
import { InviteUserModal } from './InviteUserModal';

interface ManageOwnersModalProps {
  opened: boolean;
  onClose: () => void;
  deckId: number;
  deckTitle: string;
}

export const ManageOwnersModal: React.FC<ManageOwnersModalProps> = ({
  opened,
  onClose,
  deckId,
  deckTitle
}) => {
  const { t } = useTranslation('decks');
  const { getToken } = useAuth();
  const { user } = useUser();
  
  const [owners, setOwners] = useState<DeckOwner[]>([]);
  const [invitations, setInvitations] = useState<DeckInvitation[]>([]);
  const [loading, setLoading] = useState(false);
  const [inviteModalOpened, setInviteModalOpened] = useState(false);

  useEffect(() => {
    if (opened) {
      loadData();
    }
  }, [opened]);

  const loadData = async () => {
    setLoading(true);
    try {
      const token = await getToken();
      if (!token) return;

      const [ownersData, invitationsData] = await Promise.all([
        deckOwnershipService.getOwners(deckId, token),
        deckInvitationService.getInvitationsForDeck(deckId, token)
      ]);

      setOwners(Array.isArray(ownersData) ? ownersData : []);
      setInvitations(Array.isArray(invitationsData) ? invitationsData.filter(i => i.status === InvitationStatus.Pending) : []);
    } catch (err) {
      console.error('Error loading owners:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveOwner = async (ownerClerkId: string) => {
    if (!confirm(t('ownership.confirmRemove'))) return;

    try {
      const token = await getToken();
      if (!token) return;

      await deckOwnershipService.removeOwner(deckId, ownerClerkId, token);
      await loadData();
    } catch (err: any) {
      console.error('Error removing owner:', err);
      alert(err.response?.data?.error || t('ownership.removeError'));
    }
  };

  const handleCancelInvitation = async (invitationId: number) => {
    if (!confirm(t('ownership.confirmCancel'))) return;

    try {
      const token = await getToken();
      if (!token) return;

      await deckInvitationService.cancelInvitation(invitationId, token);
      await loadData();
    } catch (err) {
      console.error('Error canceling invitation:', err);
      alert(t('ownership.cancelError'));
    }
  };

  const getStatusBadge = (status: InvitationStatus) => {
    const colors: Record<InvitationStatus, string> = {
      [InvitationStatus.Pending]: 'yellow',
      [InvitationStatus.Accepted]: 'green',
      [InvitationStatus.Declined]: 'red',
      [InvitationStatus.Cancelled]: 'gray'
    };

    const statusNames: Record<InvitationStatus, string> = {
      [InvitationStatus.Pending]: 'pending',
      [InvitationStatus.Accepted]: 'accepted',
      [InvitationStatus.Declined]: 'declined',
      [InvitationStatus.Cancelled]: 'cancelled'
    };

    return (
      <Badge color={colors[status]} size="sm">
        {t(`ownership.status.${statusNames[status]}`)}
      </Badge>
    );
  };

  return (
    <>
      <Modal
        show={opened}
        onClose={onClose}
        title={t('ownership.modalTitle')}
        size="lg"
      >
        <div className="flex items-center gap-2 mb-4">
          <HiUserGroup className="w-5 h-5" />
          <span className="text-lg font-semibold">{t('ownership.modalTitle')}</span>
        </div>
        {loading ? (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-6">
            {/* Current Owners */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold">
                  {t('ownership.currentOwners')} ({owners.length})
                </h3>
                <Button
                  size="sm"
                  onClick={() => setInviteModalOpened(true)}
                >
                  <HiUserAdd className="mr-2 h-4 w-4" />
                  {t('ownership.inviteUser')}
                </Button>
              </div>

              <div className="space-y-2">
                {owners.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    {t('ownership.noOwners')}
                  </div>
                ) : (
                  owners.map((owner) => (
                    <div
                      key={owner.clerkId}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {owner.userEmail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">
                            {owner.userEmail}
                            {owner.clerkId === user?.id && (
                              <Badge size="sm" color="blue">
                                {t('ownership.you')}
                              </Badge>
                            )}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('ownership.addedAt', {
                              date: new Date(owner.addedAt).toLocaleDateString()
                            })}
                          </div>
                        </div>
                      </div>

                      {owner.clerkId !== user?.id && (
                        <button
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                          onClick={() => handleRemoveOwner(owner.clerkId)}
                        >
                          <HiTrash className="w-5 h-5" />
                        </button>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Pending Invitations */}
            {invitations.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <HiClock className="w-5 h-5 text-yellow-500" />
                  <h3 className="text-lg font-semibold">
                    {t('ownership.pendingInvitations')} ({invitations.length})
                  </h3>
                </div>

                <div className="space-y-2">
                  {invitations.map((invitation) => (
                    <div
                      key={invitation.invitationId}
                      className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-yellow-500 text-white rounded-full flex items-center justify-center font-semibold">
                          {invitation.invitedUserEmail.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{invitation.invitedUserEmail}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {t('ownership.invitedAt', {
                              date: new Date(invitation.invitedAt).toLocaleDateString()
                            })}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {getStatusBadge(invitation.status)}
                        <button
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition"
                          onClick={() => handleCancelInvitation(invitation.invitationId)}
                        >
                          <HiX className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="flex justify-end mt-6">
          <Button onClick={onClose}>
            {t('common.close')}
          </Button>
        </div>
      </Modal>

      <InviteUserModal
        opened={inviteModalOpened}
        onClose={() => setInviteModalOpened(false)}
        deckId={deckId}
        deckTitle={deckTitle}
        onInviteSent={loadData}
      />
    </>
  );
};