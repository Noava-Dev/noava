import { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Label,
  TextInput,
  Checkbox,
} from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useDeckInvitationService } from '../../services/DeckInvitationService';

interface InviteUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (email: string, isOwner: boolean) => Promise<void>;
  itemType: string;
  itemName: string;
}

export const InviteUserModal = ({
  isOpen,
  onClose,
  onInvite,
  itemType,
  itemName,
  deckId,
  deckTitle,
}: InviteUserModalProps) => {
  const { t } = useTranslation(['decks', 'common']);
  const [email, setEmail] = useState('');
  const [isOwner, setIsOwner] = useState(false);
  const deckInvitationService = useDeckInvitationService();
  const [userId, setUserId] = useState('');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      setLoading(true);
      await onInvite(email, isOwner);
      setEmail('');
      setIsOwner(false);
      onClose();
    } catch (error) {
      console.error('Error inviting user:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setEmail('');
    setIsOwner(false);
    onClose();
  };

  return (
    <Modal show={isOpen} onClose={handleClose} size="md">
      <ModalHeader>{t('decks:invite.title', { deckName: itemName })}</ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="email">{t('decks:invite.emailLabel')}</Label>
            <TextInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('decks:invite.emailPlaceholder')}
              required
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Checkbox
                id="isOwner"
                checked={isOwner}
                onChange={(e) => setIsOwner(e.target.checked)}
              />
              <Label htmlFor="isOwner" className="font-medium">
                {t('decks:invite.ownerLabel')}
              </Label>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
              {t('decks:invite.ownerHelp')}
            </p>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button color="gray" onClick={handleClose} disabled={loading} type="button">
              {t('common:actions.cancel')}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? t('decks:invite.inviting') : t('decks:invite.inviteButton')}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};