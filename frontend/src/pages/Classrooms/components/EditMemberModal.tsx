import {
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Button,
  Checkbox,
  Label,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type { ClerkUserResponse } from '../../../models/User';

interface EditMemberModalProps {
  show: boolean;
  member?: ClerkUserResponse | null;
  canEdit: boolean;
  onClose: () => void;
  onSave: (isTeacher: boolean) => Promise<void>;
}

export default function EditMemberModal({
  show,
  member,
  canEdit,
  onClose,
  onSave,
}: EditMemberModalProps) {
  const { t } = useTranslation('classrooms');
  const [isTeacher, setIsTeacher] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setIsTeacher(member?.isTeacher ?? false);
  }, [member]);

  const handleSave = async () => {
    if (!canEdit || !member) return;
    try {
      setSaving(true);
      await onSave(isTeacher);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal show={show} onClose={onClose} size="md" dismissible>
      <ModalHeader>{t('members.editTitle', 'Edit member')}</ModalHeader>
      <ModalBody>
        {member ? (
          <div className="flex items-center justify-between">
            <div className="text-sm">
              <div className="font-semibold text-gray-900 dark:text-gray-100">
                {member.firstName} {member.lastName}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {member.email}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                id="isTeacher"
                checked={isTeacher}
                onChange={(e) =>
                  setIsTeacher((e.target as HTMLInputElement).checked)
                }
                disabled={!canEdit}
              />
              <Label
                htmlFor="isTeacher"
                className="text-gray-700 dark:text-gray-200">
                {t('members.isTeacher', 'Is teacher')}
              </Label>
            </div>
          </div>
        ) : null}
      </ModalBody>
      <ModalFooter>
        <div className="flex flex-1 flex-col gap-3 sm:flex-row">
          <Button
            className="w-full sm:flex-1"
            onClick={handleSave}
            size="sm"
            disabled={!canEdit || saving}>
            {saving
              ? t('members.saving', 'Saving...')
              : t('members.updateButton', 'Update Member')}
          </Button>
          <Button color="gray" onClick={onClose} size="sm" className="w-full sm:w-auto">
            {t('common:actions.cancel')}
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
