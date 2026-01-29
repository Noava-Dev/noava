import { Label, TextInput, Textarea, Button } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiX } from 'react-icons/hi';
import type { ClassroomResponse, ClassroomRequest } from '../../models/Classroom';
import { useToast } from '../../contexts/ToastContext';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (c: ClassroomRequest) => void;
  classroom?: ClassroomResponse;
}

function ClassroomModal({ isOpen, onClose, onSubmit, classroom }: ClassroomModalProps) {
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
    if (!name || !description) return showError(t('toast.nameAndDescriptionRequired'), t('toast.nameAndDescriptionRequired'));

    onSubmit({ name, description });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>

      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-xl w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{classroom ? t('modal.editTitle') : t('modal.createTitle')}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
            <HiX className="h-6 w-6" />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className='flex flex-col gap-2'>
              <Label htmlFor="name">{t('modal.nameLabel')} *</Label>
              <TextInput id="name" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>

            <div className='flex flex-col gap-2'>
              <Label htmlFor="description">{t('modal.descriptionLabel')}</Label>
              <Textarea id="description" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1">{classroom ? t('modal.updateButton') : t('modal.createButton')}</Button>
              <Button color="gray" onClick={onClose} type="button">{t('modal.cancelButton')}</Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ClassroomModal;