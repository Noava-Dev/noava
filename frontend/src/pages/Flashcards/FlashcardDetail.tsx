import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownItem } from 'flowbite-react';
import {
  HiArrowLeft,
  HiPlus,
  HiPlay,
  HiRefresh,
  HiUserGroup,
  HiCog,
  HiDocumentText,
  HiPencil,
  HiTrash,
  HiChevronDown,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useDeckService } from '../../services/DeckService';
import { useFlashcardService } from '../../services/FlashcardService';
import { useToast } from '../../contexts/ToastContext';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import FlashcardModal from '../../shared/components/FlashcardModal';
import type { Deck } from '../../models/Deck';
import type {
  Flashcard,
  CreateFlashcardRequest,
  UpdateFlashcardRequest,
} from '../../models/Flashcard';
import Searchbar from '../../shared/components/Searchbar';
import { useAzureBlobService } from '../../services/AzureBlobService';
import { ManageOwnersModal } from '../../shared/components/ManageOwnersModal';
import BackButton from '../../shared/components/navigation/BackButton';
import PageHeader from '../../shared/components/PageHeader';

interface FlashcardWithImages extends Flashcard {
  frontImageUrl?: string | null;
  backImageUrl?: string | null;
}

function FlashcardDetail() {
  const { deckId } = useParams<{ deckId: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation('flashcards');
  const deckService = useDeckService();
  const flashcardService = useFlashcardService();
  const { showError, showSuccess } = useToast();
  const azureBlobService = useAzureBlobService();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [flashcards, setFlashcards] = useState<FlashcardWithImages[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedFlashcard, setSelectedFlashcard] = useState<
    Flashcard | undefined
  >(undefined);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<number | null>(null);
  const [manageOwnersOpened, setManageOwnersOpened] = useState(false);

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

      // Load images for all cards
      const cardsWithImages = await Promise.all(
        cards.map(async (card) => {
          let frontImageUrl = null;
          let backImageUrl = null;

          // Load front image if exists
          if (card.frontImage) {
            try {
              frontImageUrl = await azureBlobService.getSasUrl(
                'card-images',
                card.frontImage
              );
            } catch (error) {
              console.error(
                `Failed to load front image for card ${card.cardId}:`,
                error
              );
            }
          }

          // Load back image if exists
          if (card.backImage) {
            backImageUrl = await azureBlobService.getSasUrl(
              'card-images',
              card.backImage
            );
          }

          return {
            ...card,
            frontImageUrl,
            backImageUrl,
          };
        })
      );

      setFlashcards(cardsWithImages);
    } catch (error) {
      showError(t('flashcardDetail.error'), t('flashcardDetail.error'));
    }
  };

  const handleCreateFlashcard = async (flashcard: CreateFlashcardRequest) => {
    try {
      if (selectedFlashcard) {
        await flashcardService.update(
          selectedFlashcard.cardId,
          flashcard as UpdateFlashcardRequest
        );
        showSuccess('Success', 'Flashcard updated successfully');
      } else {
        await flashcardService.create(Number(deckId), flashcard);
        showSuccess('Success', 'Flashcard created successfully');
      }
      setIsModalOpen(false);
      setSelectedFlashcard(undefined);
      await fetchFlashcards();
    } catch (error) {
      showError(
        'Error',
        selectedFlashcard
          ? 'Failed to update flashcard'
          : 'Failed to create flashcard'
      );
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
      <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <main className="flex-1 w-full ml-0 md:ml-64">
          <div className="container max-w-6xl px-4 py-8 mx-auto">
            <div className="animate-pulse">
              <div className="h-12 mb-8 rounded bg-background-surface-light dark:bg-background-surface-dark w-96"></div>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-32 rounded bg-background-surface-light dark:bg-background-surface-dark"></div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!deck) {
    navigate('/not-found', { replace: true });
    return;
  }

  // Filter flashcards based on search term
  const filteredFlashcards = flashcards.filter(
    (card) =>
      card.frontText.toLowerCase().includes(searchTerm.toLowerCase()) ||
      card.backText.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Stats
  const totalCards = flashcards.length;
  const masteredCards = 0;
  const learningCards = 0;
  const newCards = totalCards;

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
        <PageHeader>
          <div className="flex flex-col gap-4 md:gap-6">
            {/* Back Button */}
            <BackButton text={t('flashcardDetail.backToDeck')} href="/decks" />
            <div className="space-y-2">
              <span className="text-xs font-bold tracking-wider uppercase text-cyan-500 dark:text-cyan-400">
                {deck.language}
              </span>
              <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                {deck.title}
              </h1>
              {deck.description && (
                <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                  {deck.description}
                </p>
              )}
              {flashcards.length > 0 && !searchTerm && (
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {flashcards.length}
                  {flashcards.length === 1 ? ' card' : ' cards'}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-between mb-8">
              <div className="flex gap-3">
                <Button
                  size="lg"
                  onClick={() => {
                    setSelectedFlashcard(undefined);
                    setIsModalOpen(true);
                  }}>
                  <HiPlus className="mr-2 size-5" />
                  {t('flashcardDetail.addCard')}
                </Button>
                <Button size="lg" disabled={totalCards === 0}>
                  <HiPlay className="mr-2 size-5" />
                  {t('flashcardDetail.studyNow')}
                </Button>
                <Dropdown
                    label=""
                    dismissOnClick={true}
                    renderTrigger={() => (
                      <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600">
                        <HiPlay className="w-5 h-5 mr-2" />
                        {t('flashcardDetail.quickReview')}
                        <HiChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  >
                    <DropdownItem
                      icon={HiPlay}
                      onClick={() => navigate(`/decks/${deckId}/quickReview`)}
                    >
                      {t('flashcardDetail.flipMode')}
                    </DropdownItem>
                    <DropdownItem
                      icon={HiPencil}
                      onClick={() => navigate(`/decks/${deckId}/writeReview`)}
                    >
                      {t('flashcardDetail.writeReview')}
                    </DropdownItem>
                    <DropdownItem
                      icon={HiRefresh}
                      onClick={() => navigate(`/decks/${deckId}/reverseReview`)}
                    >
                      {t('flashcardDetail.reverseReview')}
                    </DropdownItem>
                  </Dropdown>
              </div>
              <div className="flex gap-3">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-secondary-600 to-secondary-700 hover:shadow-sm hover:border-border"
                  onClick={() => setManageOwnersOpened(true)}>
                  <HiUserGroup className="mr-2 size-5" />
                  {t('decks:ownership.manageAccess')}
                </Button>
              </div>
            </div>

            {/* Search */}
            <div className="p-4 border shadow-sm border-border bg-background-app-light dark:bg-background-surface-dark rounded-2xl md:p-6 dark:border-border-dark">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                    {t('common:actions.search')}
                  </label>
                  <Searchbar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                  />
                  {/* {searchTerm && (
                  <p className="flex items-center gap-1 text-xs text-text-body-light dark:text-text-body-dark">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
                    {sorted.length} {t('common:search.found')}
                  </p>
                )} */}
                </div>

                {/* <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide text-gray-700 uppercase dark:text-gray-300">
                  {t('common:sort.label')}
                </label>
                <Select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(
                      e.target.value as 'newest' | 'oldest' | 'az' | 'za'
                    )
                  }
                  className="cursor-pointer">
                  <option value="newest">{t('common:sort.newest')}</option>
                  <option value="oldest">{t('common:sort.oldest')}</option>
                  <option value="az">{t('common:sort.az')}</option>
                  <option value="za">{t('common:sort.za')}</option>
                </Select>
              </div> */}
              </div>
            </div>
          </div>
        </PageHeader>
        <div className="container max-w-6xl px-4 py-6 mx-auto md:py-8">
          {/* Header */}
          <div className="mb-8">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-text-title-light md:text-4xl dark:text-text-title-dark">
                  {totalCards}
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('flashcardDetail.totalReviews')}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold md:text-4xl text-cyan-500 dark:text-cyan-400">
                  {masteredCards}
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('flashcardDetail.mastered')}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-yellow-500 md:text-4xl dark:text-yellow-400">
                  {learningCards}
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('flashcardDetail.learning')}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-1 text-3xl font-bold text-blue-500 md:text-4xl dark:text-blue-400">
                  {newCards}
                </div>
                <div className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {t('flashcardDetail.new')}
                </div>
              </div>
            </div>
          </div>

          {/* Flashcards List or Empty State */}
          {filteredFlashcards.length === 0 ? (
            <div className="py-20 text-center">
              <div className="mb-6">
                <HiDocumentText className="mx-auto size-24 text-text-muted-light dark:text-text-muted-dark" />
              </div>
              <p className="mb-3 text-xl font-semibold text-text-body-light dark:text-text-body-dark">
                {searchTerm ? 'No flashcards found' : 'No flashcards yet'}
              </p>
              <p className="mb-6 text-text-muted-light dark:text-text-muted-dark">
                {searchTerm
                  ? 'Try adjusting your search'
                  : 'Start learning by creating your first flashcard!'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 b">
              {filteredFlashcards.map((card) => (
                <div
                  key={card.cardId}
                  className="relative overflow-hidden transition-shadow border rounded-lg shadow-md bg-background-app-light border-border dark:bg-background-surface-dark hover:shadow-lg dark:border-border-dark">
                  {/* Action buttons */}
                  <div className="absolute z-10 flex gap-2 top-4 right-4">
                    <button
                      onClick={() => handleEditFlashcard(card)}
                      className="p-2 transition-colors rounded-lg text-text-muted-light dark:text-text-muted-dark hover:shadow-md hover:text-cyan-500 dark:hover:text-cyan-400 hover:bg-background-app-light dark:hover:bg-background-surface-dark"
                      title={t('common:actions.edit')}>
                      <HiPencil className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteFlashcard(card.cardId)}
                      className="p-2 transition-colors rounded-lg text-text-muted-light dark:text-text-muted-dark hover:shadow-md hover:text-red-500 dark:hover:text-red-400 hover:bg-background-app-light dark:hover:bg-background-surface-dark"
                      title={t('common:actions.delete')}>
                      <HiTrash className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Front Side */}
                  <div className="p-6 mt-2">
                    <div className="flex flex-col gap-2 mb-4">
                      <div className="mb-2 text-xs font-semibold tracking-wide uppercase text-cyan-500 dark:text-cyan-400">
                        {t('flashcardDetail.frontSide')}
                      </div>

                      {/* Front Image */}
                      {card.frontImageUrl && (
                        <div className="flex justify-center p-2 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
                          <img
                            src={card.frontImageUrl}
                            alt="Front"
                            className="object-contain max-w-full rounded-lg max-h-40"
                          />
                        </div>
                      )}

                      {/* Front Text */}
                      <p className="text-lg font-semibold text-text-title-light dark:text-text-title-dark line-clamp-2">
                        {card.frontText}
                      </p>
                    </div>

                    {/* Divider */}
                    <div className="flex flex-col gap-2 pt-4 border-t border-border dark:border-border-dark">
                      <div className="mb-2 text-xs font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                        {t('flashcardDetail.backSide')}
                      </div>

                      {/* Back Image */}
                      {card.backImageUrl && (
                        <div className="flex justify-center p-2 rounded-lg bg-background-subtle-light dark:bg-background-subtle-dark">
                          <img
                            src={card.backImageUrl}
                            alt="Back"
                            className="object-contain max-w-full rounded-lg max-h-40"
                          />
                        </div>
                      )}

                      {/* Back Text */}
                      <p className="text-text-body-light dark:text-text-body-dark line-clamp-2">
                        {card.backText}
                      </p>
                    </div>

                    {/* Memo */}
                    {card.memo && (
                      <div>
                        <span className="flex-shrink-0 text-yellow-500 dark:text-yellow-400"></span>
                        <p className="text-xs italic text-text-muted-light dark:text-text-muted-dark line-clamp-2">
                          {card.memo}
                        </p>
                      </div>
                    )}
                  </div>
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
              onClick={cancelDelete}></div>

            {/* Modal */}
            <div className="relative w-full max-w-md p-6 rounded-lg shadow-xl bg-background-app-light dark:bg-background-surface-dark">
              <h2 className="mb-3 text-xl font-bold text-text-title-light dark:text-text-title-dark">
                {t('common:modals.deleteModal.title')}
              </h2>
              <p className="mb-6 text-text-body-light dark:text-text-body-dark">
                {t('common:modals.deleteModal.message')}
              </p>
              {/* Actions */}
              <div className="flex gap-3">
                <Button color="red" onClick={confirmDelete} className="flex-1">
                  {t('common:actions.cancel')}
                </Button>
                <Button color="gray" onClick={cancelDelete} className="flex-1">
                  {t('common:actions.cancel')}
                </Button>
              </div>
            </div>
          </div>
        )}

        <ManageOwnersModal
          opened={manageOwnersOpened}
          onClose={() => setManageOwnersOpened(false)}
          deckId={parseInt(deckId!)}
          deckTitle={deck?.title || ''}
        />

        <NoavaFooter />
      </div>
    </div>
  );
}

export default FlashcardDetail;
