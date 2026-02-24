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
  confirmDisabled?: boolean;
  cancelDisabled?: boolean;
  confirmClassName?: string;
  cancelClassName?: string;
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
  confirmDisabled = false,
  cancelDisabled = false,
  confirmClassName,
  cancelClassName,
  onConfirm,
  onCancel,
}) => {
  const { t } = useTranslation();

  const confirmText = confirmLabel ?? t('common:actions.confirm');
  const cancelText = cancelLabel ?? t('common:actions.cancel');

  return (
    <Modal show={show} onClose={onCancel} size={size} dismissible>
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalBody>
        {message && (
          <p className="text-text-muted-light dark:text-text-muted-dark">
            {message}
          </p>
        )}
      </ModalBody>
      <ModalFooter>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Button
            color={confirmColor as any}
            onClick={onConfirm}
            size="sm"
            disabled={confirmDisabled}
            className={`w-full sm:flex-1 ${confirmClassName ?? ''}`}>
            {confirmText}
          </Button>
          <Button
            color={cancelColor as any}
            onClick={onCancel}
            size="sm"
            disabled={cancelDisabled}
            className={`w-full sm:w-auto ${cancelClassName ?? ''}`}>
            {cancelText}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;
