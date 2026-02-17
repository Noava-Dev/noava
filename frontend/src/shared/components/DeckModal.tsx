import {
  Label,
  TextInput,
  Textarea,
  Select,
  Button,
  FileInput,
  Modal,
  ModalBody,
  ModalHeader,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiUpload } from 'react-icons/hi';
import { DeckVisibility, Deck, DeckRequest } from '../../models/Deck';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { useToast } from '../../contexts/ToastContext';
interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deck: DeckRequest) => void;
  deck?: Deck;
}

function DeckModal({ isOpen, onClose, onSubmit, deck }: DeckModalProps) {
  const { t } = useTranslation('decks');
  const azureBlobService = useAzureBlobService();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('');
  const [visibility, setVisibility] = useState<DeckVisibility>(
    DeckVisibility.Private
  );
  const [coverImageBlobName, setCoverImageBlobName] = useState<
    string | undefined
  >(undefined);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const { showError } = useToast();

  useEffect(() => {
    if (deck) {
      setTitle(deck.title);
      setDescription(deck.description || '');
      setLanguage(deck.language || '');
      setVisibility(deck.visibility);
      setCoverImageBlobName(deck.coverImageBlobName);

      if (deck.coverImageBlobName) {
        azureBlobService
          .getSasUrl('deck-images', deck.coverImageBlobName)
          .then((url) => setImagePreview(url));
      } else {
        setImagePreview(null);
      }
    } else {
      setTitle('');
      setDescription('');
      setLanguage('');
      setVisibility(DeckVisibility.Private);
      setCoverImageBlobName(undefined);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [deck, isOpen]);

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

    // Validation
    if (!title.trim()) {
      showError(t('toast.error'), t('modal.titleRequired'));
      return;
    }

    if (!language) {
      showError(t('toast.error'), t('modal.languageRequired'));
      return;
    }

    try {
      setUploading(true);

      let finalBlobName = coverImageBlobName;
      if (imageFile) {
        finalBlobName = await azureBlobService.upload('deck-images', imageFile);
      }

      // Backend security update: expects format {GUID}_{extension} (underscore, not dot)
      // Convert blob name from "uuid.ext" to "uuid_ext"
      // let cleanBlobName = finalBlobName;
      // if (cleanBlobName) {
      //   // Replace the last dot with underscore (e.g., "uuid.jpg" -> "uuid_jpg")
      //   const lastDotIndex = cleanBlobName.lastIndexOf('.');
      //   if (lastDotIndex !== -1) {
      //     cleanBlobName = cleanBlobName.substring(0, lastDotIndex) + '_' + cleanBlobName.substring(lastDotIndex + 1);
      //   }
      // }

      const deckData: DeckRequest = {
        title: title.trim(),
        description: description.trim() || undefined,
        language: language.trim(),
        visibility,
        coverImageBlobName: finalBlobName,
      };

      onSubmit(deckData);

      setTitle('');
      setDescription('');
      setLanguage('');
      setVisibility(DeckVisibility.Private);
      setCoverImageBlobName(undefined);
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      showError(t('toast.uploadError'), t('toast.uploadError'));
    } finally {
      setUploading(false);
    }
  };

  const getVisibilityHelpText = () => {
    switch (visibility) {
      case DeckVisibility.Private:
        return t('common:visibility.visibilityHelp.private');
      case DeckVisibility.Shared:
        return t('common:visibility.visibilityHelp.shared');
      case DeckVisibility.Public:
        return t('common:visibility.visibilityHelp.public');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="2xl"
      position="center"
      dismissible>
      {/* Modal Content */}
      <div className="relative bg-background-app-light dark:bg-background-surface-dark rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <ModalHeader>
          {deck ? t('modal.editTitle') : t('modal.createTitle')}
        </ModalHeader>
        {/* Body */}
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">{t('modal.titleLabel')} *</Label>
              <TextInput
                id="title"
                type="text"
                placeholder={t('modal.titlePlaceholder')}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={uploading}
              />
            </div>

            {/* Language */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="language">{t('modal.languageLabel')} *</Label>
              <Select
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                required
                disabled={uploading}>
                <option value="">{t('languages.select')}</option>
                <option value={t('languages.dutch')}>
                  {t('languages.dutch')}
                </option>
                <option value={t('languages.french')}>
                  {t('languages.french')}
                </option>
                <option value={t('languages.english')}>
                  {t('languages.english')}
                </option>
                <option value={t('languages.german')}>
                  {t('languages.german')}
                </option>
                <option value={t('languages.spanish')}>
                  {t('languages.spanish')}
                </option>
                <option value={t('languages.italian')}>
                  {t('languages.italian')}
                </option>
              </Select>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="description">{t('modal.descriptionLabel')}</Label>
              <Textarea
                id="description"
                placeholder={t('modal.descriptionPlaceholder')}
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={uploading}
              />
            </div>

            {/* Image Upload */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="image">{t('modal.imageLabel')}</Label>

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
                {t('modal.imageHelp')}
              </p>
            </div>

            {/* Visibility */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="visibility">
                {t('common:visibility.label')} *
              </Label>
              <Select
                id="visibility"
                value={visibility}
                onChange={(e) =>
                  setVisibility(String(e.target.value) as DeckVisibility)
                }
                disabled={uploading}>
                <option value={DeckVisibility.Private}>
                  {t('common:visibility.private')}
                </option>
                <option value={DeckVisibility.Shared}>
                  {t('common:visibility.shared')}
                </option>
                <option value={DeckVisibility.Public}>
                  {t('common:visibility.public')}
                </option>
              </Select>
              <p className="mt-1 text-xs text-text-body-light dark:text-text-body-dark">
                {getVisibilityHelpText()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={uploading}>
                {uploading ? (
                  <>
                    <HiUpload className="mr-2 size-5 animate-spin" />
                    {t('modal.uploading')}
                  </>
                ) : deck ? (
                  t('modal.updateButton')
                ) : (
                  t('modal.createButton')
                )}
              </Button>
              <Button
                color="gray"
                onClick={onClose}
                disabled={uploading}
                type="button">
                {t('common:actions.cancel')}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default DeckModal;
