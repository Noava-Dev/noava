import {
  Label,
  TextInput,
  Textarea,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  FileInput,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import type {
  ClassroomResponse,
  ClassroomRequest,
} from '../../models/Classroom';
import FormErrorMessage from './validation/FormErrorMessage';
import { useAzureBlobService } from '../../services/AzureBlobService';

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
  const azureBlobService = useAzureBlobService();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [coverImageBlobName, setCoverImageBlobName] = useState<string | undefined>(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (classroom) {
      setName(classroom.name);
      setDescription(classroom.description || '');
      setCoverImageBlobName(classroom.coverImageBlobName ?? undefined);

      if (classroom.coverImageBlobName) {
        azureBlobService
          .getSasUrl('classroom-images', classroom.coverImageBlobName)
          .then((url) => setImagePreview(url))
          .catch(() => setImagePreview(null));
      } else {
        setImagePreview(null);
      }
    } else {
      setName('');
      setDescription('');
      setCoverImageBlobName(undefined);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [classroom, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      setUploading(true);

      let finalBlobName = coverImageBlobName;
      if (imageFile) {
        finalBlobName = await azureBlobService.upload('classroom-images', imageFile);
      }

      onSubmit({ 
        name, 
        description, 
        coverImageBlobName: finalBlobName 
      });

      // Reset form
      setName('');
      setDescription('');
      setCoverImageBlobName(undefined);
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploading(false);
    }
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
                placeholder={t('modal.namePlaceholder', 'Enter classroom name')}
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
                placeholder={t('modal.descriptionPlaceholder', 'Enter classroom description')}
                required
              />
              {errors.description && <FormErrorMessage text={errors.description} />}
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">{t('modal.imageLabel', 'Cover Image')}</Label>

              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover w-full h-48 rounded-lg"
                  />
                </div>
              )}

              <FileInput
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                disabled={uploading}
              />
              <p className="mt-1 text-xs text-text-body-light dark:text-text-body-dark">
                {t('modal.imageHelp', 'Optional: Upload a cover image for your classroom')}
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">
              <Button type="submit" className="w-full sm:flex-1" disabled={uploading}>
                {uploading ? t('common:actions.uploading', 'Uploading...') : (classroom
                  ? t('common:actions.update')
                  : t('common:actions.create'))}
              </Button>
              <Button color="gray" onClick={onClose} type="button" className="w-full sm:w-auto" disabled={uploading}>
                {t('common:actions.cancel')}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ClassroomModal;
