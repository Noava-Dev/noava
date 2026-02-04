import {
  Label,
  TextInput,
  Textarea,
  Button,
  FileInput,
  ModalHeader,
  ModalBody,
  Modal,
} from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiUpload, HiVolumeUp, HiPhotograph } from 'react-icons/hi';
import type { Flashcard, CreateFlashcardRequest } from '../../models/Flashcard';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { useTranslation } from 'react-i18next';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flashcard: CreateFlashcardRequest) => void;
  flashcard?: Flashcard;
}

function FlashcardModal({
  isOpen,
  onClose,
  onSubmit,
  flashcard,
}: FlashcardModalProps) {
  const { t } = useTranslation('flashcards');
  const azureBlobService = useAzureBlobService();

  // State for form fields
  const [frontText, setFrontText] = useState('');
  const [backText, setBackText] = useState('');
  const [memo, setMemo] = useState('');
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  const [isFlipped, setIsFlipped] = useState(false);

  // Front side media
  const [frontImageFile, setFrontImageFile] = useState<File | null>(null);
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(
    null
  );
  const [frontImageBlobName, setFrontImageBlobName] = useState<
    string | undefined
  >(undefined);
  const [frontAudioFile, setFrontAudioFile] = useState<File | null>(null);
  const [frontAudioPreview, setFrontAudioPreview] = useState<string | null>(
    null
  );
  const [frontAudioBlobName, setFrontAudioBlobName] = useState<
    string | undefined
  >(undefined);

  // Back side media
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [backImageBlobName, setBackImageBlobName] = useState<
    string | undefined
  >(undefined);
  const [backAudioFile, setBackAudioFile] = useState<File | null>(null);
  const [backAudioPreview, setBackAudioPreview] = useState<string | null>(null);
  const [backAudioBlobName, setBackAudioBlobName] = useState<
    string | undefined
  >(undefined);

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (flashcard) {
      setFrontText(flashcard.frontText);
      setBackText(flashcard.backText);
      setMemo(flashcard.memo || '');
      setFrontImageBlobName(flashcard.frontImage);
      setFrontAudioBlobName(flashcard.frontAudio);
      setBackImageBlobName(flashcard.backImage);
      setBackAudioBlobName(flashcard.backAudio);

      // Load existing media previews
      if (flashcard.frontImage) {
        azureBlobService
          .getSasUrl('card-images', flashcard.frontImage)
          .then((url) => setFrontImagePreview(url))
          .catch(console.error);
      }
      if (flashcard.backImage) {
        azureBlobService
          .getSasUrl('card-images', flashcard.backImage)
          .then((url) => setBackImagePreview(url))
          .catch(console.error);
      }
      if (flashcard.frontAudio) {
        azureBlobService
          .getSasUrl('card-audio', flashcard.frontAudio)
          .then((url) => setFrontAudioPreview(url))
          .catch(console.error);
      }
      if (flashcard.backAudio) {
        azureBlobService
          .getSasUrl('card-audio', flashcard.backAudio)
          .then((url) => setBackAudioPreview(url))
          .catch(console.error);
      }
    } else {
      // Reset form
      setFrontText('');
      setBackText('');
      setMemo('');
      setFrontImageFile(null);
      setFrontImagePreview(null);
      setFrontImageBlobName(undefined);
      setFrontAudioFile(null);
      setFrontAudioPreview(null);
      setFrontAudioBlobName(undefined);
      setBackImageFile(null);
      setBackImagePreview(null);
      setBackImageBlobName(undefined);
      setBackAudioFile(null);
      setBackAudioPreview(null);
      setBackAudioBlobName(undefined);
    }
    setActiveTab('front');
    setIsFlipped(false);
  }, [flashcard, isOpen]);

  const handleFrontImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFrontAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFrontAudioFile(file);

      const objectUrl = URL.createObjectURL(file);
      setFrontAudioPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleBackAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackAudioFile(file);

      const objectUrl = URL.createObjectURL(file);
      setBackAudioPreview(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Upload front image if new file
      let finalFrontImage = frontImageBlobName;
      if (frontImageFile) {
        finalFrontImage = await azureBlobService.upload(
          'card-images',
          frontImageFile
        );
      }

      // Upload back image if new file
      let finalBackImage = backImageBlobName;
      if (backImageFile) {
        finalBackImage = await azureBlobService.upload(
          'card-images',
          backImageFile
        );
      }

      // Upload front audio if new file
      let finalFrontAudio = frontAudioBlobName;
      if (frontAudioFile) {
        finalFrontAudio = await azureBlobService.upload(
          'card-audio',
          frontAudioFile
        );
      }

      // Upload back audio if new file
      let finalBackAudio = backAudioBlobName;
      if (backAudioFile) {
        finalBackAudio = await azureBlobService.upload(
          'card-audio',
          backAudioFile
        );
      }

      const flashcardData: CreateFlashcardRequest = {
        frontText,
        backText,
      };

      // Only include optional fields if they have values
      if (finalFrontImage) flashcardData.frontImage = finalFrontImage;
      if (finalFrontAudio) flashcardData.frontAudio = finalFrontAudio;
      if (finalBackImage) flashcardData.backImage = finalBackImage;
      if (finalBackAudio) flashcardData.backAudio = finalBackAudio;
      if (memo) flashcardData.memo = memo;

      onSubmit(flashcardData);

      // Reset form
      setFrontText('');
      setBackText('');
      setMemo('');
      setFrontImageFile(null);
      setFrontImagePreview(null);
      setFrontImageBlobName(undefined);
      setFrontAudioFile(null);
      setFrontAudioPreview(null);
      setFrontAudioBlobName(undefined);
      setBackImageFile(null);
      setBackImagePreview(null);
      setBackImageBlobName(undefined);
      setBackAudioFile(null);
      setBackAudioPreview(null);
      setBackAudioBlobName(undefined);
    } catch (error) {
      alert(t('flashcardModal.uploadError'));
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  const currentText = isFlipped ? backText : frontText;
  const currentImage = isFlipped ? backImagePreview : frontImagePreview;

  return (
    <Modal
      show={isOpen}
      onClose={onClose}
      size="5xl"
      position="center"
      dismissible>
      {/* Modal Content */}
      <div className="relative bg-background-app-light dark:bg-background-surface-dark rounded-lg shadow-xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <ModalHeader>
          {flashcard
            ? t('flashcardModal.editTitle')
            : t('flashcardModal.createTitle')}
        </ModalHeader>

        {/* Body */}
        <ModalBody>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Section */}
            <div className="p-6 rounded-lg bg-background-subtle-light dark:bg-background-app-dark">
              <div className="mb-4 text-sm text-text-muted-light dark:text-text-muted-dark">
                {t('flashcardModal.preview')}
              </div>
              <div
                className="relative bg-background-app-light dark:bg-background-surface-dark rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer transition-colors"
                onClick={() => setIsFlipped(!isFlipped)}>
                {/* Flip indicator */}
                <div className="absolute select-none top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded bg-opacity-30 text-cyan-500 bg-cyan-600 dark:text-cyan-400 dark:bg-cyan-500 dark:bg-opacity-30">
                    {isFlipped
                      ? t('flashcardModal.back')
                      : t('flashcardModal.front')}
                  </span>
                </div>

                {/* Image preview */}
                {currentImage && (
                  <img
                    src={currentImage}
                    alt={
                      isFlipped
                        ? t('flashcardModal.back')
                        : t('flashcardModal.front')
                    }
                    className="object-contain mb-4 select-none max-h-32"
                  />
                )}

                {/* Text preview */}
                <h3 className="mb-2 text-2xl font-bold text-center select-none text-text-title-light dark:text-text-title-dark md:text-3xl">
                  {currentText ||
                    (isFlipped
                      ? t('flashcardModal.backTextPlaceholder')
                      : t('flashcardModal.frontTextPlaceholder'))}
                </h3>

                {/* Memo preview (only on back) */}
                {isFlipped && memo && (
                  <p className="text-sm italic text-center select-none text-text-muted-light dark:text-text-muted-dark">
                    {memo}
                  </p>
                )}

                {/* Flip instruction */}
                <div className="absolute text-sm select-none text-text-muted-light dark:text-text-muted-dark bottom-4">
                  {t('flashcardModal.clickToFlip')}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-border dark:border-border-dark">
              <button
                type="button"
                className={`px-6 py-3 font-semibold select-none focus:outline-none focus:ring-0 hover:border-cyan-400 transition-colors ${
                  activeTab === 'front'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-text-muted-light dark:text-text-muted-dark'
                }`}
                onClick={() => {
                  setActiveTab('front');
                  setIsFlipped(false);
                }}>
                {t('flashcardModal.frontSide')}
              </button>
              <button
                type="button"
                className={`px-6 py-3 font-semibold select-none focus:outline-none focus:ring-0 hover:border-cyan-400 transition-colors ${
                  activeTab === 'back'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-text-muted-light dark:text-text-muted-dark'
                }`}
                onClick={() => {
                  setActiveTab('back');
                  setIsFlipped(true);
                }}>
                {t('flashcardModal.backSide')}
              </button>
            </div>

            {/* Front Side Content */}
            {activeTab === 'front' && (
              <div className="space-y-4 select-none">
                <div>
                  <Label
                    htmlFor="frontText"
                    className="text-text-title-light dark:text-text-title-dark">
                    {t('flashcardModal.frontOfCard')}
                  </Label>
                  <div className="mt-2">
                    <TextInput
                      id="frontText"
                      type="text"
                      placeholder={t('flashcardModal.frontPlaceholder')}
                      value={frontText}
                      onChange={(e) => setFrontText(e.target.value)}
                      required
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Front Image */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiPhotograph className="size-5 text-text-muted-light dark:text-text-muted-dark" />
                    <Label
                      htmlFor="frontImage"
                      className="text-text-title-light dark:text-text-title-dark">
                      {t('flashcardModal.image')}
                    </Label>
                  </div>
                  {frontImagePreview && (
                    <div className="mb-3">
                      <img
                        src={frontImagePreview}
                        alt="Front preview"
                        className="object-contain w-full h-32 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark"
                      />
                    </div>
                  )}
                  <FileInput
                    id="frontImage"
                    accept="image/*"
                    onChange={handleFrontImageChange}
                    disabled={uploading}
                  />
                </div>

                {/* Front Audio */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiVolumeUp className="size-5 text-text-muted-light dark:text-text-muted-dark" />
                    <Label
                      htmlFor="frontAudio"
                      className="text-text-title-light dark:text-text-title-dark">
                      {t('flashcardModal.audio')}
                    </Label>
                  </div>
                  {frontAudioPreview && (
                    <div className="mb-3">
                      <audio controls className="w-full">
                        <source src={frontAudioPreview} />
                      </audio>
                    </div>
                  )}
                  <FileInput
                    id="frontAudio"
                    accept="audio/*"
                    onChange={handleFrontAudioChange}
                    disabled={uploading}
                  />
                </div>
              </div>
            )}

            {/* Back Side Content */}
            {activeTab === 'back' && (
              <div className="space-y-4">
                <div>
                  <Label
                    htmlFor="backText"
                    className="text-text-title-light dark:text-text-title-dark">
                    {t('flashcardModal.backOfCard')}
                  </Label>
                  <div className="mt-2">
                    <TextInput
                      id="backText"
                      type="text"
                      placeholder={t('flashcardModal.backPlaceholder')}
                      value={backText}
                      onChange={(e) => setBackText(e.target.value)}
                      required
                      disabled={uploading}
                    />
                  </div>
                </div>

                {/* Memo */}
                <div>
                  <Label
                    htmlFor="memo"
                    className="text-text-title-light dark:text-text-title-dark">
                    {t('flashcardModal.memo')}
                  </Label>
                  <div className="mt-2">
                    <Textarea
                      id="memo"
                      placeholder={t('flashcardModal.memoPlaceholder')}
                      rows={3}
                      value={memo}
                      onChange={(e) => setMemo(e.target.value)}
                      disabled={uploading}
                      maxLength={100}
                    />
                    <p className="mt-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                      {memo.length}/100 {t('flashcardModal.characters')}
                    </p>
                  </div>
                </div>

                {/* Back Image */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiPhotograph className="size-5 text-text-muted-light dark:text-text-muted-dark" />
                    <Label
                      htmlFor="backImage"
                      className="text-text-title-light dark:text-text-title-dark">
                      {t('flashcardModal.image')}
                    </Label>
                  </div>
                  {backImagePreview && (
                    <div className="mb-3">
                      <img
                        src={backImagePreview}
                        alt="Back preview"
                        className="object-contain w-full h-32 bg-background-subtle-light dark:bg-background-subtle-dark"
                      />
                    </div>
                  )}
                  <FileInput
                    id="backImage"
                    accept="image/*"
                    onChange={handleBackImageChange}
                    disabled={uploading}
                  />
                </div>

                {/* Back Audio */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiVolumeUp className="size-5 text-text-muted-light dark:text-text-muted-dark" />
                    <Label
                      htmlFor="backAudio"
                      className="text-text-title-light dark:text-text-title-dark">
                      {t('flashcardModal.audio')}
                    </Label>
                  </div>
                  {backAudioPreview && (
                    <div className="mb-3">
                      <audio controls className="w-full">
                        <source src={backAudioPreview} />
                      </audio>
                    </div>
                  )}
                  <FileInput
                    id="backAudio"
                    accept="audio/*"
                    onChange={handleBackAudioChange}
                    disabled={uploading}
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4">
              <Button type="submit" className="flex-1" disabled={uploading}>
                {uploading ? (
                  <>
                    <HiUpload className="mr-2 size-5 animate-spin" />
                    {t('flashcardModal.uploading')}
                  </>
                ) : flashcard ? (
                  t('flashcardModal.updateButton')
                ) : (
                  t('flashcardModal.createButton')
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

export default FlashcardModal;
