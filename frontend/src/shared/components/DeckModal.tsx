import {
  Label,
  TextInput,
  Textarea,
  Select,
  Button,
  FileInput,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { HiX, HiUpload } from 'react-icons/hi';
import { DeckVisibility, Deck, CreateDeckRequest } from '../../models/Deck';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { useToast } from '../../contexts/ToastContext';
interface DeckModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (deck: CreateDeckRequest) => void;
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

    try {
      setUploading(true);

      let finalBlobName = coverImageBlobName;
      if (imageFile) {
        finalBlobName = await azureBlobService.upload('deck-images', imageFile);
      }

      onSubmit({
        title,
        description: description || undefined,
        language,
        visibility,
        coverImageBlobName: finalBlobName,
      });

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
        return t('modal.visibilityHelp.private');
      case DeckVisibility.Shared:
        return t('modal.visibilityHelp.shared');
      case DeckVisibility.Public:
        return t('modal.visibilityHelp.public');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {deck ? t('modal.editTitle') : t('modal.createTitle')}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            disabled={uploading}>
            <HiX className="w-6 h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
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
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {t('modal.imageHelp')}
              </p>
            </div>

            {/* Visibility */}
            <div className="flex flex-col gap-2">
              <Label htmlFor="visibility">{t('modal.visibilityLabel')} *</Label>
              <Select
                id="visibility"
                value={visibility}
                onChange={(e) =>
                  setVisibility(String(e.target.value) as DeckVisibility)
                }
                disabled={uploading}>
                <option value={DeckVisibility.Private}>
                  {t('modal.visibilityPrivate')}
                </option>
                <option value={DeckVisibility.Shared}>
                  {t('modal.visibilityShared')}
                </option>
                <option value={DeckVisibility.Public}>
                  {t('modal.visibilityPublic')}
                </option>
              </Select>
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {getVisibilityHelpText()}
              </p>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={uploading}>
                {uploading ? (
                  <>
                    <HiUpload className="w-5 h-5 mr-2 animate-spin" />
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
                {t('modal.cancelButton')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default DeckModal;
