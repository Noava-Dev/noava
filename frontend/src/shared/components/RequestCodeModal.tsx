import React from 'react';
import { useTranslation } from 'react-i18next';
import ConfirmModal from './ConfirmModal';

interface Props {
  show: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const RequestCodeModal: React.FC<Props> = ({ show, onConfirm, onCancel }) => {
  const { t } = useTranslation('classrooms');

  return (
    <ConfirmModal
      show={show}
      title={t('requestCodeModal.title')}
      message={t('requestCodeModal.message')}
      confirmLabel={t('common:actions.request')}
      cancelLabel={t('common:actions.cancel')}
      confirmColor="primary"
      onConfirm={onConfirm}
      onCancel={onCancel}
      size="md"
    />
  );
};

export default RequestCodeModal;
