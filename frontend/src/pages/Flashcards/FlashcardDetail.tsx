import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { 
  HiArrowLeft, 
  HiPlus, 
  HiPlay, 
  HiRefresh, 
  HiUserGroup, 
  HiCog,
  HiDocumentText,
  HiPencil,
  HiTrash
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useDeckService } from '../../services/DeckService';
import { useFlashcardService } from '../../services/FlashcardService';
import { useToast } from '../../contexts/ToastContext';
import NoavaFooter from '../../shared/components/NoavaFooter';
import FlashcardModal from '../../shared/components/FlashcardModal';
import type { Deck } from '../../models/Deck';
import type { Flashcard, CreateFlashcardRequest, UpdateFlashcardRequest } from '../../models/Flashcard';
import Searchbar from '../../shared/components/Searchbar';

function FlashcardDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('flashcards');
  const deckService = useDeckService();
  const flashcardService = useFlashcardService();
  const { showError, showSuccess } = useToast();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<Flashcard | undefined>(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (deckId) {
      fetchDeck();
      fetchFlashcards();
    }
  }, [deckId]);

  const fetchDeck = async () => {
    try {
      setLoading(true);
      const deckData = await deckService.getById(Number(deckId));
      setDeck(deckData);
    } catch (error) {
      showError(t('flashcardDetail.error'), t('flashcardDetail.error'));
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFlashcards = async () => {
    try {
      const cards = await flashcardService.getByDeckId(Number(deckId));
      setFlashcards(cards);
    } catch (error) {
      showError(t('flashcardDetail.error'), t('flashcardDetail.error'));
      console.error(error);
    }
  };

  const handleCreateFlashcard = async (flashcard: CreateFlashcardRequest) => {
    try {
      if (selectedFlashcard) {
        // Update existing flashcard
        await flashcardService.update(selectedFlashcard.cardId, flashcard as UpdateFlashcardRequest);
        showSuccess('Success', 'Flashcard updated successfully');
      } else {
        // Create new flashcard
        await flashcardService.create(Number(deckId), flashcard);
        showSuccess('Success', 'Flashcard created successfully');
      }
      setIsModalOpen(false);
      setSelectedFlashcard(undefined);
      await fetchFlashcards();
    } catch (error) {
      showError('Error', selectedFlashcard ? 'Failed to update flashcard' : 'Failed to create flashcard');
      console.error(error);
    }
  };

  const handleEditFlashcard = (flashcard: Flashcard) => {
    setSelectedFlashcard(flashcard);
    setIsModalOpen(true);
  };

  const handleDeleteFlashcard = async (cardId: number) => {
    setCardToDelete(cardId);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (cardToDelete === null) return;
    
    try {
      await flashcardService.delete(cardToDelete);
      showSuccess('Success', 'Flashcard deleted successfully');
      setDeleteConfirmOpen(false);
      setCardToDelete(null);
      await fetchFlashcards();
    } catch (error) {
      showError('Error', 'Failed to delete flashcard');
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmOpen(false);
    setCardToDelete(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFlashcard(undefined);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-white dark:bg-gray-900">
        <main className="ml-0 md:ml-64 flex-1 w-full">
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded w-96 mb-8"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">{t('flashcardDetail.notFound')}</p>
          <Button onClick={() => navigate('/decks')}>{t('flashcardDetail.backToDeck')}</Button>
        </div>
      </div>
    );
  }

  // Filter flashcards based on search term
  const filteredFlashcards = flashcards.filter(card => 
    card.frontText.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.backText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalCards = flashcards.length;
  const masteredCards = 0;
  const learningCards = 0;
  const newCards = totalCards;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="ml-0 flex-1 w-full">
        <div className="container mx-auto px-4 py-6 md:py-8 max-w-6xl">
          {/* Back Button */}
          <button
            onClick={() => navigate('/decks')}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors"
          >
            <HiArrowLeft className="h-5 w-5" />
            <span>{t('flashcardDetail.backToDeck')}</span>
          </button>

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold text-cyan-500 dark:text-cyan-400 uppercase tracking-wider">
                {deck.language}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {deck.title}
            </h1>
            {deck.description && (
              <p className="text-gray-600 dark:text-gray-400 text-lg mb-6">
                {deck.description}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3 mb-8">
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600"
                disabled={totalCards === 0}
              >
                <HiPlay className="w-5 h-5 mr-2" />
                Study Now
              </Button>
              <Button
                size="lg"
                color="dark"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
                disabled={totalCards === 0}
              >
                <HiRefresh className="w-5 h-5 mr-2" />
                Shuffle
              </Button>
              <Button
                size="lg"
                color="dark"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 ml-auto"
              >
                <HiUserGroup className="w-5 h-5 mr-2" />
              </Button>
              <Button
                size="lg"
                color="dark"
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700"
              >
                <HiCog className="w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-1">
                  {totalCards}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('flashcardDetail.totalReviews')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-cyan-500 dark:text-cyan-400 mb-1">
                  {masteredCards}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('flashcardDetail.mastered')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-yellow-500 dark:text-yellow-400 mb-1">
                  {learningCards}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('flashcardDetail.learning')}</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-blue-500 dark:text-blue-400 mb-1">
                  {newCards}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">{t('flashcardDetail.new')}</div>
              </div>
            </div>

            {/* Search & Add Card */}
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1">
                <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
              </div>
              <Button
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 whitespace-nowrap"
                onClick={() => {
                  setSelectedFlashcard(undefined);
                  setIsModalOpen(true);
                }}
              >
                <HiPlus className="mr-2 h-5 w-5" />
                {t('flashcardDetail.addCard')}
              </Button>
            </div>
          </div>

          {/* Flashcards List or Empty State */}
          {filteredFlashcards.length === 0 ? (
            <div className="text-center py-20">
              <div className="mb-6">
                <HiDocumentText className="w-24 h-24 text-gray-400 dark:text-gray-600 mx-auto" />
              </div>
              <p className="text-gray-700 dark:text-gray-400 text-xl font-semibold mb-3">
                {searchTerm ? 'No flashcards found' : 'No flashcards yet'}
              </p>
              <p className="text-gray-600 dark:text-gray-500 mb-6">
                {searchTerm ? 'Try adjusting your search' : 'Start learning by creating your first flashcard!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredFlashcards.map((card) => (
                <div
                  key={card.cardId}
                  className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow p-6 border border-gray-200 dark:border-gray-700 relative"
                >
                  {/* Action buttons */}
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button
                      onClick={() => handleEditFlashcard(card)}
                      className="p-2 text-gray-400 hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title={t('flashcardDetail.editCard')}
                    >
                      <HiPencil className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFlashcard(card.cardId)}
                      className="p-2 text-gray-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title={t('flashcardDetail.deleteCard')}
                    >
                      <HiTrash className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="mb-4 pr-20">
                    <div className="text-xs text-cyan-500 dark:text-cyan-400 font-semibold mb-2">{t('flashcardDetail.frontSide')}</div>
                    <p className="text-gray-900 dark:text-white text-lg font-semibold">{card.frontText}</p>
                  </div>
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-semibold mb-2">{t('flashcardDetail.backSide')}</div>
                    <p className="text-gray-700 dark:text-gray-300">{card.backText}</p>
                  </div>
                  {card.memo && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-500 dark:text-gray-400 italic">{card.memo}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Flashcard Modal */}
        <FlashcardModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={handleCreateFlashcard}
          flashcard={selectedFlashcard}
        />

        {/* Delete Confirmation Modal */}
        {deleteConfirmOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={cancelDelete}
            ></div>

            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full p-6">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                {t('deleteConfirmModal.title')}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('deleteConfirmModal.message')}
              </p>
              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  color="red"
                  onClick={confirmDelete}
                  className="flex-1"
                >
                  {t('deleteConfirmModal.confirm')}
                </Button>
                <Button
                  color="gray"
                  onClick={cancelDelete}
                  className="flex-1"
                >
                  {t('deleteConfirmModal.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        <NoavaFooter />
      </div>
    </div>
  );
}

export default FlashcardDetail;