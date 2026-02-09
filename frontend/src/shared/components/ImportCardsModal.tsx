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
import { useToast } from '../../contexts/ToastContext';
import { useFlashcardService } from '../../services/FlashcardService';
import { useParams } from 'react-router-dom';

interface ImportCardsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function ImportCardsModal({ isOpen, onClose }: ImportCardsModalProps) {
    const { deckId } = useParams<{ deckId: string }>();
    const [uploading, setUploading] = useState(false);
    const { showError, showSuccess } = useToast();
    const [file, setFile] = useState<File | null>(null);
    const flashcardService = useFlashcardService();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };
      

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!file) {
            showError('Please select a file to upload', 'Error');
            return;
        }
        try {
            setUploading(true);
            const count = await flashcardService.createBulk(Number(deckId), file);
            showSuccess(`${count} cards imported successfully`, 'Success');
            onClose();
        } catch {
            showError('Failed to upload file', 'Error');
        } finally {
            setUploading(false);
        }
      }
    
  return (
    <Modal show={isOpen} onClose={onClose} dismissible>
      <div className="bg-background-app-light dark:bg-background-surface-dark">

      <ModalHeader>
        Import Cards
      </ModalHeader>
      <ModalBody>
        <form onSubmit={handleSubmit}>
            <div className='flex flex-col gap-6 mb-4'>
                <div className='flex flex-col items-center gap-1 text-center border-b border-border dark:border-border-dark pb-4'>
                    <FaCloudUploadAlt className='size-24 dark:text-primary-500 text-primary-700' />
                    <h3 className='text-xl font-semibold text-text-title-light dark:text-text-title-dark'>Import your flashcards</h3>
                    <p className='text-sm text-text-body-light dark:text-text-body-dark'>Bring your data from any source. We support CSV and Excel. Read our <span>Docs</span> for more information about formats.</p>
                </div>
            </div>
                <div>
                    <Label className="mb-2 block" htmlFor="file-upload-helper-text">
                        Upload file
                    </Label>
                    <FileInput id="file-upload-helper-text" onChange={handleFileChange} />
                    <HelperText className="mt-1 ml-1">Supported Files: .csv, .xls, .xlsx</HelperText>
                </div>
                {/* Supported file types */}
                <div className='flex gap-2 justify-center'>
                    {/* CSV */}
                    <div className='flex flex-col items-center gap-1 shadow-md text-text-body-light dark:text-text-body-dark bg-background-app-light dark:bg-background-app-dark px-3 py-2 rounded'>
                        <PiFileCsv className='size-6' />
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">CSV</p>
                    </div>
                    {/* Excel */}
                    <div className='flex flex-col items-center gap-1 shadow-md text-text-body-light dark:text-text-body-dark bg-background-app-light dark:bg-background-app-dark px-3 py-2 rounded'>
                        <PiMicrosoftExcelLogo className='size-6' />
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">Excel</p>
                    </div>
                </div>
            {/* Actions */}
            <div className="flex gap-3 pt-6">
                <Button type="submit" className="flex-1" disabled={uploading}>
                    {uploading ? (
                      <>
                        <HiUpload className="mr-2 size-5 animate-spin" />
                            Uploading...
                      </>
                    ) : "Upload"}
                </Button>
                <Button
                    color="gray"
                    onClick={onClose}
                    disabled={uploading}
                    type="button">
                    Cancel
                </Button>
            </div>
        </form>
      </ModalBody>
      </div>
    </Modal>
  );
};

export default ImportCardsModal;