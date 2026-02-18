import { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  Button,
  Label,
  TextInput,
  Checkbox,
  Tooltip,
} from 'flowbite-react';
import { useTranslation } from 'react-i18next';


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
  itemName,
}: InviteUserModalProps) => {
  const { t } = useTranslation(['decks', 'common']);
  const [email, setEmail] = useState('');
  const [isOwner, setIsOwner] = useState(false);


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
            <Tooltip content={t('common:tooltips.markAsOwner')}>
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
            </Tooltip>
            <p className="text-xs text-gray-500 dark:text-gray-400 ml-6">
              {t('decks:invite.ownerHelp')}
            </p>
          </div>

          <div className="flex flex-col-reverse gap-2 pt-4 sm:flex-row sm:justify-end">
            <Button color="gray" onClick={handleClose} disabled={loading} type="button" className="w-full sm:w-auto">
              {t('common:actions.cancel')}
            </Button>
            <Button type="submit" disabled={loading} className="w-full sm:w-auto">
              {loading ? t('decks:invite.inviting') : t('decks:invite.inviteButton')}
            </Button>
          </div>
        </form>
      </ModalBody>
    </Modal>
  );
};