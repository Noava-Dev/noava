import React, { useState } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  TextInput,
} from 'flowbite-react';
import { useTranslation } from 'react-i18next';

interface InviteMemberModalProps {
  show: boolean;
  onClose: () => void;
  onInvite: (email: string) => Promise<void> | void;
  canInvite?: boolean;
}

const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  show,
  onClose,
  onInvite,
  canInvite = true,
}) => {
  const { t } = useTranslation('classrooms');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInvite = async () => {
    const trimmed = email.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      await onInvite(trimmed);
      setEmail('');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="md">
      <ModalHeader>{t('members.inviteTitle')}</ModalHeader>
      <ModalBody>
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            {t('members.inviteHelp')}
          </p>
          <TextInput
            id="invite-email"
            placeholder={t('members.invitePlaceholder')}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col-reverse justify-end w-full gap-3 sm:flex-row">
          <Button color="gray" onClick={onClose} size="sm" className="w-full sm:w-auto">
            {t('common:actions.cancel')}
          </Button>
          <Button
            onClick={handleInvite}
            disabled={!canInvite || loading || !email.trim()}
            size="sm"
            className="w-full sm:w-auto">
            {t('common:actions.invite')}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default InviteMemberModal;
