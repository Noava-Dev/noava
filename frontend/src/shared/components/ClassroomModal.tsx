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
import FormErrorMessage from './validation/FormErrorMessage';

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
  const { t } = useTranslation(['classrooms', 'errors']);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

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
    
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = t('errors:validation.name.required');
    }

    if (!description.trim()) {
      newErrors.description = t('errors:validation.description.required');
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      return;
    }

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
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">{t('modal.nameLabel')} *</Label>
              <TextInput
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
              {errors.name && <FormErrorMessage text={errors.name} />}
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="description">{t('modal.descriptionLabel')} *</Label>
              <Textarea
                id="description"
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
              {errors.description && <FormErrorMessage text={errors.description} />}
            </div>

            <div className="flex flex-col-reverse gap-3 pt-4 sm:flex-row">
              <Button color="gray" onClick={onClose} type="button" className="w-full sm:w-auto">
                {t('common:actions.cancel')}
              </Button>
              <Button type="submit" className="w-full sm:flex-1">
                {classroom
                  ? t('common:actions.update')
                  : t('common:actions.create')}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ClassroomModal;
