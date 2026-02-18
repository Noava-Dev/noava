import {
  Modal,
  ModalBody,
  ModalHeader,
  Label,
  FileInput,
  Button,
  HelperText,
} from 'flowbite-react';
import { useState } from 'react';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { HiUpload } from 'react-icons/hi';
import { PiFileCsv, PiMicrosoftExcelLogo } from 'react-icons/pi';
import { useToast } from '../../../contexts/ToastContext';
import { useFlashcardService } from '../../../services/FlashcardService';
import { useParams } from 'react-router-dom';
import FormErrorMessage from '../../../shared/components/validation/FormErrorMessage';
import { useTranslation } from 'react-i18next';

interface ImportCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

function ImportCardsModal({
  isOpen,
  onClose,
  onSubmit,
}: ImportCardsModalProps) {
  const { deckId } = useParams<{ deckId: string }>();
  const [uploading, setUploading] = useState(false);
  const { showError, showSuccess } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const flashcardService = useFlashcardService();
  const [error, setError] = useState<string>('');
  const { t } = useTranslation('flashcards');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    try {
      setUploading(true);
      const count = await flashcardService.createBulk(Number(deckId), file);
      showSuccess(`${count} cards imported successfully`, 'Success');
      onClose();

      onSubmit();
    } catch (error: any) {
      setError((error as Error).message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal show={isOpen} onClose={onClose} dismissible>
      <div className="bg-background-app-light dark:bg-background-surface-dark">
        <ModalHeader>{t('importCardsModal.header')}</ModalHeader>
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6 mb-4">
              <div className="flex flex-col items-center gap-1 pb-4 text-center border-b border-border dark:border-border-dark">
                <FaCloudUploadAlt className="size-24 dark:text-primary-500 text-primary-700" />
                <h3 className="text-xl font-semibold text-text-title-light dark:text-text-title-dark">
                  {t('importCardsModal.title')}
                </h3>
                <p className="text-sm text-text-body-light dark:text-text-body-dark">
                  {t('importCardsModal.subtitle')}
                </p>
              </div>
            </div>
            <div>
              <Label className="block mb-2" htmlFor="file-upload-helper-text">
                {t('importCardsModal.upload')}
              </Label>
              <FileInput
                id="file-upload-helper-text"
                onChange={handleFileChange}
              />
              <HelperText className="mt-1 ml-1">
                {t('importCardsModal.supported')}.csv, .xls, .xlsx
              </HelperText>
              {error && <FormErrorMessage text={error} />}
            </div>
            {/* Supported file types */}
            <div className="flex justify-center gap-2">
              {/* CSV */}
              <div className="flex flex-col items-center gap-1 px-3 py-2 rounded shadow-md text-text-body-light dark:text-text-body-dark bg-background-app-light dark:bg-background-app-dark">
                <PiFileCsv className="size-6" />
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  CSV
                </p>
              </div>
              {/* Excel */}
              <div className="flex flex-col items-center gap-1 px-3 py-2 rounded shadow-md text-text-body-light dark:text-text-body-dark bg-background-app-light dark:bg-background-app-dark">
                <PiMicrosoftExcelLogo className="size-6" />
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                  Excel
                </p>
              </div>
            </div>
            {/* Actions */}
            <div className="flex flex-col-reverse gap-3 pt-6 sm:flex-row">
              <Button
                color="gray"
                onClick={onClose}
                disabled={uploading}
                type="button"
                className="w-full sm:w-auto">
                {t('common:actions.cancel')}
              </Button>
              <Button type="submit" className="w-full sm:flex-1" disabled={uploading}>
                {uploading ? (
                  <>
                    <HiUpload className="mr-2 size-5 animate-spin" />
                    {t('common:actions.uploading')}
                  </>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </form>
        </ModalBody>
      </div>
    </Modal>
  );
}

export default ImportCardsModal;
