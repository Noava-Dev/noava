import { useEffect, useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  TextInput,
  Avatar,
  Badge,
} from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '../../contexts/ToastContext';
import { useDeckService } from '../../services/DeckService';
import type { Deck } from '../../models/Deck';
import type { ClerkUserResponse } from '../../models/User';
import { useUser } from '@clerk/clerk-react';
import { InviteUserModal } from './InviteUserModal';
import { HiClipboardCopy, HiRefresh, HiTrash, HiUserAdd, HiUserRemove } from 'react-icons/hi';
import ConfirmModal from './ConfirmModal';

interface ManageOwnersModalProps {
  isOpen: boolean;
  onClose: () => void;
  deck: Deck;
  onUpdate: () => void;
}

export const ManageOwnersModal = ({
  isOpen,
  onClose,
  deck,
  onUpdate,
}: ManageOwnersModalProps) => {
  const { t } = useTranslation(['decks', 'common']);
  const { showSuccess, showError } = useToast();
  const deckService = useDeckService();
  const { user } = useUser();

  const [users, setUsers] = useState<ClerkUserResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [updatingJoinCode, setUpdatingJoinCode] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [userToRemove, setUserToRemove] = useState<ClerkUserResponse | null>(null);
  const [removingUser, setRemovingUser] = useState(false);

  const isCreator = user?.id === deck?.userId;
  const currentUserData = users.find(u => u.clerkId === user?.id);
  const isOwner = currentUserData?.isOwner || false;
  const canManageUsers = isCreator || isOwner;

  useEffect(() => {
    if (isOpen && deck) {
      loadUsers();
    }
  }, [isOpen, deck?.deckId]);

  const loadUsers = async () => {
    if (!deck) {
      console.error('No deck provided to ManageOwnersModal');
      return;
    }

    try {
      setLoading(true);
      const usersData = await deckService.getUsersByDeck(deck.deckId, 1, 50);
      setUsers(usersData);
    } catch (error: any) {
      console.error('Error loading users:', error);
      let errorMessage = t('decks:owners.loadError');
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      
      showError(t('common:toast.error'), errorMessage);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInvite = async (email: string, isOwner: boolean) => {
    if (!deck) return;
    try {
      await deckService.inviteByEmail(deck.deckId, email, isOwner);
      showSuccess(t('common:toast.success'), t('decks:invite.success'));
      await loadUsers();
      onUpdate();
    } catch (error: any) {
      console.error('Error inviting user:', error);
      let errorMessage = t('decks:invite.error');
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      
      showError(t('common:toast.error'), errorMessage);
    }
  };

  const handleRemoveUser = async () => {
    if (!deck || !userToRemove) return;

    try {
      setRemovingUser(true);
      await deckService.removeUser(deck.deckId, userToRemove.clerkId);
      showSuccess(t('common:toast.success'), t('decks:owners.removeSuccess'));
      await loadUsers();
      onUpdate();
    } catch (error: any) {
      console.error('Error removing user:', error);
      let errorMessage = t('decks:owners.removeError');
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.title) {
          errorMessage = error.response.data.title;
        }
      }
      
      showError(t('common:toast.error'), errorMessage);
    } finally {
      setRemovingUser(false);
      setConfirmModalOpen(false);
      setUserToRemove(null);
    }
  };

  const openRemoveConfirm = (user: ClerkUserResponse) => {
    setUserToRemove(user);
    setConfirmModalOpen(true);
  };

  const handleToggleOwner = async (targetUser: ClerkUserResponse) => {
    if (!deck) return;

    try {
      await deckService.inviteByEmail(deck.deckId, targetUser.email, !targetUser.isOwner);
      showSuccess(t('common:toast.success'), t('decks:owners.updateSuccess'));
      await loadUsers();
      onUpdate();
    } catch (error: any) {
      console.error('Error updating user role:', error);
      showError(t('common:toast.error'), t('decks:owners.updateError'));
    }
  };

  const handleCopyJoinCode = () => {
    if (deck?.joinCode) {
      navigator.clipboard.writeText(deck.joinCode);
      showSuccess(t('common:toast.success'), t('decks:owners.codeCopied'));
    }
  };

  const handleUpdateJoinCode = async () => {
    if (!deck) return;
    
    if (!confirm(t('decks:owners.confirmRegenerateCode'))) return;

    try {
      setUpdatingJoinCode(true);
      await deckService.updateJoinCode(deck.deckId);
      showSuccess(t('common:toast.success'), t('decks:owners.codeRegenerated'));
      onUpdate();
    } catch (error) {
      console.error('Error updating join code:', error);
      showError(t('common:toast.error'), t('decks:owners.codeRegenerateError'));
    } finally {
      setUpdatingJoinCode(false);
    }
  };

  return (
    <>
      <Modal show={isOpen} onClose={onClose} size="2xl" dismissible>
        <ModalHeader>{t('decks:owners.title')}</ModalHeader>
        <ModalBody>
          {!deck ? (
            <div className="flex justify-center py-8">
              <Spinner size="lg" />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Join Code Section */}
              <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-800">
                <h3 className="mb-2 text-sm font-semibold">
                  {t('decks:owners.joinCodeSection')}
                </h3>
                <p className="mb-3 text-xs text-gray-600 dark:text-gray-400">
                  {t('decks:owners.joinCodeDescription')}
                </p>
                <div className="flex gap-2 items-center">
                  <TextInput
                    value={deck.joinCode || 'No code available'}
                    readOnly
                    className="flex-1"
                  />
                  <Button
                    size="sm"
                    color="gray"
                    onClick={handleCopyJoinCode}
                    disabled={!deck.joinCode}
                  >
                    <HiClipboardCopy className="w-4 h-4 mr-1" />
                    {t('decks:owners.copyCode')}
                  </Button>
                  <Button
                    size="sm"
                    color="gray"
                    onClick={handleUpdateJoinCode}
                    disabled={updatingJoinCode || !deck.joinCode}
                  >
                    {updatingJoinCode ? (
                      <Spinner size="sm" />
                    ) : (
                      <>
                        <HiRefresh className="w-4 h-4 mr-1" />
                        {t('decks:owners.regenerateCode')}
                      </>
                    )}
                  </Button>
                </div>
              </div>

              {/* Users List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold">
                    {t('decks:owners.title')}
                  </h3>
                  {canManageUsers && (
                    <Button
                      size="sm"
                      onClick={() => setInviteModalOpen(true)}
                    >
                      <HiUserAdd className="w-4 h-4 mr-1" />
                      {t('decks:owners.inviteButton')}
                    </Button>
                  )}
                </div>

                {loading ? (
                  <div className="flex justify-center py-4">
                    <Spinner />
                  </div>
                ) : users.length === 0 ? (
                  <p className="text-sm text-center text-gray-500 dark:text-gray-400 py-4">
                    {t('decks:owners.noUsers')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {users.map((userData) => {
                      const isCurrentUser = userData.clerkId === user?.id;
                      const isDeckCreator = userData.clerkId === deck.userId;
                      const canRemove = canManageUsers && !isDeckCreator && !isCurrentUser;
                      const canToggleOwner = canManageUsers && !isDeckCreator && !isCurrentUser;

                      return (
                        <div
                          key={userData.clerkId}
                          className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800"
                        >
                          <div className="flex items-center gap-3">
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                  {userData.firstName} {userData.lastName}
                                </span>
                                {isCurrentUser && (
                                  <span className="text-xs text-gray-500">
                                    {t('decks:owners.you')}
                                  </span>
                                )}
                              </div>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                {userData.email}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            {isDeckCreator ? (
                              <Badge color="success">{t('decks:owners.owner')}</Badge>
                            ) : userData.isOwner ? (
                              <Badge color="info">{t('decks:owners.owner')}</Badge>
                            ) : (
                              <Badge color="gray">{t('decks:owners.member')}</Badge>
                            )}

                            {canToggleOwner && (
                              <Button
                                size="xs"
                                color={userData.isOwner ? "gray" : "info"}
                                onClick={() => handleToggleOwner(userData)}
                              >
                                {userData.isOwner ? (
                                  <>
                                    <HiUserRemove className="w-3 h-3 mr-1" />
                                    {t('decks:owners.removeOwner')}
                                  </>
                                ) : (
                                  <>
                                    <HiUserAdd className="w-3 h-3 mr-1" />
                                    {t('decks:owners.makeOwner')}
                                  </>
                                )}
                              </Button>
                            )}

                            {canRemove && (
                              <Button
                                size="xs"
                                color="failure"
                                onClick={() => openRemoveConfirm(userData)}
                              >
                                <HiTrash className="w-3 h-3 mr-1" />
                                {t('decks:owners.remove')}
                              </Button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="gray" onClick={onClose} className="ml-auto">
            {t('common:actions.close')}
          </Button>
        </ModalFooter>
      </Modal>

      {deck && (
        <InviteUserModal
          isOpen={inviteModalOpen}
          onClose={() => setInviteModalOpen(false)}
          onInvite={handleInvite}
          itemType="deck"
          itemName={deck.title}
        />
      )}

      <ConfirmModal
        show={confirmModalOpen}
        onConfirm={handleRemoveUser}
        onCancel={() => {
          setConfirmModalOpen(false);
          setUserToRemove(null);
        }}
        title={t('decks:owners.confirmRemove')}
        message={t('decks:owners.confirmRemoveMessage', {
          name: userToRemove ? `${userToRemove.firstName} ${userToRemove.lastName}` : ''
        })}
      />
    </>
  );
};