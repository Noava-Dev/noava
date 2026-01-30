import { Label, TextInput, Textarea, Button, FileInput } from 'flowbite-react';
import { useState, useEffect } from 'react';
import { HiX, HiUpload, HiVolumeUp, HiPhotograph } from 'react-icons/hi';
import type { Flashcard, CreateFlashcardRequest } from '../../models/Flashcard';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { useTranslation } from 'react-i18next';

interface FlashcardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (flashcard: CreateFlashcardRequest) => void;
  flashcard?: Flashcard;
}

function FlashcardModal({ isOpen, onClose, onSubmit, flashcard }: FlashcardModalProps) {
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
  const [frontImagePreview, setFrontImagePreview] = useState<string | null>(null);
  const [frontImageBlobName, setFrontImageBlobName] = useState<string | undefined>(undefined);
  const [frontAudioFile, setFrontAudioFile] = useState<File | null>(null);
  const [frontAudioPreview, setFrontAudioPreview] = useState<string | null>(null);
  const [frontAudioBlobName, setFrontAudioBlobName] = useState<string | undefined>(undefined);
  
  // Back side media
  const [backImageFile, setBackImageFile] = useState<File | null>(null);
  const [backImagePreview, setBackImagePreview] = useState<string | null>(null);
  const [backImageBlobName, setBackImageBlobName] = useState<string | undefined>(undefined);
  const [backAudioFile, setBackAudioFile] = useState<File | null>(null);
  const [backAudioPreview, setBackAudioPreview] = useState<string | null>(null);
  const [backAudioBlobName, setBackAudioBlobName] = useState<string | undefined>(undefined);
  
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
        azureBlobService.getBlobSasUrl(flashcard.frontImage)
          .then(url => setFrontImagePreview(url))
          .catch(console.error);
      }
      if (flashcard.backImage) {
        azureBlobService.getBlobSasUrl(flashcard.backImage)
          .then(url => setBackImagePreview(url))
          .catch(console.error);
      }
      if (flashcard.frontAudio) {
        azureBlobService.getBlobSasUrl(flashcard.frontAudio)
          .then(url => setFrontAudioPreview(url))
          .catch(console.error);
      }
      if (flashcard.backAudio) {
        azureBlobService.getBlobSasUrl(flashcard.backAudio)
          .then(url => setBackAudioPreview(url))
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
      const reader = new FileReader();
      reader.onloadend = () => {
        setFrontAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBackAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setBackAudioFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setBackAudioPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setUploading(true);

      // Upload front image if new file
      let finalFrontImage = frontImageBlobName;
      if (frontImageFile) {
        finalFrontImage = await azureBlobService.uploadImage(frontImageFile);
      }

      // Upload back image if new file
      let finalBackImage = backImageBlobName;
      if (backImageFile) {
        finalBackImage = await azureBlobService.uploadImage(backImageFile);
      }

      // Upload front audio if new file
      let finalFrontAudio = frontAudioBlobName;
      if (frontAudioFile) {
        finalFrontAudio = await azureBlobService.uploadImage(frontAudioFile);
      }

      // Upload back audio if new file
      let finalBackAudio = backAudioBlobName;
      if (backAudioFile) {
        finalBackAudio = await azureBlobService.uploadImage(backAudioFile);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal Content */}
      <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {flashcard ? t('flashcardModal.editTitle') : t('flashcardModal.createTitle')}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              {t('flashcardModal.subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            disabled={uploading}
          >
            <HiX className="h-6 w-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Preview Section */}
            <div className="bg-gray-900 rounded-lg p-6">
              <div className="text-sm text-gray-400 mb-4">{t('flashcardModal.preview')}</div>
              <div 
                className="relative bg-gray-800 rounded-lg p-8 min-h-[300px] flex flex-col items-center justify-center cursor-pointer hover:bg-gray-750 transition-colors"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                {/* Flip indicator */}
                <div className="absolute top-4 left-4">
                  <span className="inline-block px-3 py-1 text-xs font-semibold text-cyan-400 bg-cyan-500 bg-opacity-20 rounded">
                    {isFlipped ? t('flashcardModal.back') : t('flashcardModal.front')}
                  </span>
                </div>

                {/* Image preview */}
                {currentImage && (
                  <img 
                    src={currentImage} 
                    alt={isFlipped ? t('flashcardModal.back') : t('flashcardModal.front')}
                    className="max-h-32 object-contain mb-4"
                  />
                )}

                {/* Text preview */}
                <h3 className="text-2xl md:text-3xl font-bold text-white text-center mb-2">
                  {currentText || (isFlipped ? t('flashcardModal.backTextPlaceholder') : t('flashcardModal.frontTextPlaceholder'))}
                </h3>

                {/* Memo preview (only on back) */}
                {isFlipped && memo && (
                  <p className="text-gray-400 text-sm text-center italic">
                    {memo}
                  </p>
                )}

                {/* Flip instruction */}
                <div className="absolute bottom-4 text-gray-500 text-sm">
                  {t('flashcardModal.clickToFlip')}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-700">
              <button
                type="button"
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'front'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('front')}
              >
                {t('flashcardModal.frontSide')}
              </button>
              <button
                type="button"
                className={`px-6 py-3 font-semibold transition-colors ${
                  activeTab === 'back'
                    ? 'text-cyan-400 border-b-2 border-cyan-400'
                    : 'text-gray-400 hover:text-gray-300'
                }`}
                onClick={() => setActiveTab('back')}
              >
                {t('flashcardModal.backSide')}
              </button>
            </div>

            {/* Front Side Content */}
            {activeTab === 'front' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="frontText" className="text-gray-900 dark:text-white">
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

                {/* Front Image - COMMENTED OUT
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiPhotograph className="h-5 w-5 text-gray-400" />
                    <Label htmlFor="frontImage" className="text-gray-900 dark:text-white">
                      {t('flashcardModal.image')}
                    </Label>
                  </div>
                  {frontImagePreview && (
                    <div className="mb-3">
                      <img
                        src={frontImagePreview}
                        alt="Front preview"
                        className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
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
                */}

                {/* Front Audio - COMMENTED OUT
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiVolumeUp className="h-5 w-5 text-gray-400" />
                    <Label htmlFor="frontAudio" className="text-gray-900 dark:text-white">
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
                */}
              </div>
            )}

            {/* Back Side Content */}
            {activeTab === 'back' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="backText" className="text-gray-900 dark:text-white">
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
                  <Label htmlFor="memo" className="text-gray-900 dark:text-white">
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
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {memo.length}/100 {t('flashcardModal.characters')}
                    </p>
                  </div>
                </div>

                {/* Back Image - COMMENTED OUT
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiPhotograph className="h-5 w-5 text-gray-400" />
                    <Label htmlFor="backImage" className="text-gray-900 dark:text-white">
                      {t('flashcardModal.image')}
                    </Label>
                  </div>
                  {backImagePreview && (
                    <div className="mb-3">
                      <img
                        src={backImagePreview}
                        alt="Back preview"
                        className="w-full h-32 object-contain bg-gray-100 dark:bg-gray-700 rounded-lg"
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
                */}

                {/* Back Audio - COMMENTED OUT
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <HiVolumeUp className="h-5 w-5 text-gray-400" />
                    <Label htmlFor="backAudio" className="text-gray-900 dark:text-white">
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
                */}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button 
                type="submit" 
                className="flex-1 bg-cyan-500 hover:bg-cyan-600" 
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <HiUpload className="mr-2 h-5 w-5 animate-spin" />
                    {t('flashcardModal.uploading')}
                  </>
                ) : (
                  flashcard ? t('flashcardModal.updateButton') : t('flashcardModal.createButton')
                )}
              </Button>
              <Button 
                color="gray" 
                onClick={onClose} 
                disabled={uploading} 
                type="button"
              >
                {t('flashcardModal.cancel')}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FlashcardModal;