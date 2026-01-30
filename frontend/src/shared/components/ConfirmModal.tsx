import React from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'flowbite-react';
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

  const confirmText = confirmLabel ?? t('actions.confirm');
  const cancelText = cancelLabel ?? t('actions.cancel');

  return (
    <Modal show={show} onClose={onCancel} size={size}>
      {title && <ModalHeader>{title}</ModalHeader>}
      <ModalBody>
        {message && <p className="text-gray-600 dark:text-gray-400">{message}</p>}
      </ModalBody>
      <ModalFooter>
        <div className="flex justify-end gap-3 w-full">
          <Button color={cancelColor as any} onClick={onCancel} size="sm">{cancelText}</Button>
          <Button color={confirmColor as any} onClick={onConfirm} size="sm">{confirmText}</Button>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ConfirmModal;