import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal, TextInput, Button, ModalBody, ModalHeader, Label } from 'flowbite-react';
import { useAuth } from '@clerk/clerk-react';
import { deckInvitationService } from '../../services/DeckInvitationService';

interface InviteUserModalProps {
  opened: boolean;
  onClose: () => void;
  deckId: number;
  deckTitle: string;
  onInviteSent: () => void;
}

export const InviteUserModal: React.FC<InviteUserModalProps> = ({
  opened,
  onClose,
  deckId,
  deckTitle,
  onInviteSent
}) => {
  const { t } = useTranslation('decks');
  const { getToken } = useAuth();
  
  const [userId, setUserId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId.trim()) {
      setError(t('ownership.inviteModal.userIdRequired'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = await getToken();
      if (!token) throw new Error('Not authenticated');

      await deckInvitationService.inviteUser(deckId, userId, token);
      
      setUserId('');
      onInviteSent();
      onClose();
    } catch (err: any) {
      console.error('Error inviting user:', err);
      console.error('Response data:', err.response?.data);
      
      if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError(t('ownership.inviteModal.error'));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setUserId('');
    setError(null);
    onClose();
  };

  return (
    <Modal
      show={opened}
      onClose={handleClose}
      popup
    >
      <ModalHeader>{t('ownership.inviteModal.title', { deckTitle })}</ModalHeader>
      <ModalBody>
      <form onSubmit={handleSubmit}>
        <Label htmlFor="userId" className="mb-2 block">
          {t('ownership.inviteModal.userIdLabel')}
        </Label>
        <TextInput
          id="userId"
          type="text"
          placeholder="userId"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          color={error ? 'failure' : undefined}
          //helperText={error && <span className="text-red-600">{error}</span>}
          required
          disabled={loading}
          autoFocus
        />

        <div className="mt-4 text-sm text-gray-600 dark:text-gray-400">
          {t('ownership.inviteModal.helperText')}
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button
            color="gray"
            onClick={handleClose}
            disabled={loading}
          >
            {t('common.cancel')}
          </Button>
          <Button
            type="submit"
            disabled={loading}
          >
            {t('ownership.inviteModal.sendInvite')}
          </Button>
        </div>
      </form>
      </ModalBody>
    </Modal>
  );
};