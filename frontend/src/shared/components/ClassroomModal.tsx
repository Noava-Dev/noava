import {
  Label,
  TextInput,
  Textarea,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  ClassroomResponse,
  ClassroomRequest,
} from '../../models/Classroom';
import { useToast } from '../../contexts/ToastContext';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (c: ClassroomRequest) => void;
  classroom?: ClassroomResponse;
}

function ClassroomModal({
  isOpen,
  onClose,
  onSubmit,
  classroom,
}: ClassroomModalProps) {
  const { t } = useTranslation('classrooms');
  const { showError } = useToast();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');

  useEffect(() => {
    if (classroom) {
      setName(classroom.name);
      setDescription(classroom.description || '');
      setJoinCode(classroom.joinCode || '');
    } else {
      setName('');
      setDescription('');
      setJoinCode('');
    }
  }, [classroom, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description)
      return showError(t('app.error'), t('toast.nameAndDescriptionRequired'));

    onSubmit({ name, description });
  };

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="xl"
      position="center"
      dismissible>
      {/* Modal Content */}
      <div className="relative w-full rounded-lg shadow-xl bg-background-app-light dark:bg-background-surface-dark">
        {/* Header */}
        <ModalHeader>
          {classroom ? t('modal.editTitle') : t('modal.createTitle')}
        </ModalHeader>

        {/* Body */}
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t('modal.nameLabel')} *</Label>
              <TextInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">{t('modal.descriptionLabel')}</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">
                {classroom ? t('modal.updateButton') : t('modal.createButton')}
              </Button>
              <Button color="gray" onClick={onClose} type="button">
                {t('modal.cancelButton')}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ClassroomModal;
