import React from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'flowbite-react';
import { useTranslation } from 'react-i18next';

interface ConfirmModalProps {
  show: boolean;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  size?: 'sm' | 'md' | 'lg';
  confirmColor?: string;
  cancelColor?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  show,
  title,
  message,
  confirmLabel,
  cancelLabel,
  size = 'md',
  confirmColor = 'red',
  cancelColor = 'gray',
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  const confirmText = confirmLabel ?? t('common:actions.confirm');
  const cancelText = cancelLabel ?? t('common:actions.cancel');

  return (
    <Modal show={show} onClose={onCancel} size={size}>
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalBody>
        {message && (
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {message}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-col-reverse w-full gap-3 sm:flex-row sm:justify-end">
          <Button color={cancelColor as any} onClick={onCancel} size="sm" className="w-full sm:w-auto">
            {cancelText}
          </Button>
          <Button color={confirmColor as any} onClick={onConfirm} size="sm" className="w-full sm:w-auto">
            {confirmText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
