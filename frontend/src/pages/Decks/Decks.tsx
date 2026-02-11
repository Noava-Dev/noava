import { useState, useEffect } from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
} from 'flowbite-react';
import { Modal } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import PageHeader from '../../shared/components/PageHeader';
import DeckCard from '../../shared/components/DeckCard';
import DeckModal from '../../shared/components/DeckModal';
import { BulkReviewModal } from '../../shared/components/BulkReviewModal';
import Searchbar from '../../shared/components/Searchbar';
import { useDeckService } from '../../services/DeckService';
import { useToast } from '../../contexts/ToastContext';
import type { Deck, DeckRequest } from '../../models/Deck';
import Skeleton from '../../shared/components/loading/Skeleton';
import EmptyState from '../../shared/components/EmptyState';

function DecksPage() {
  const { t } = useTranslation('decks');

  const deckService = useDeckService();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const { showSuccess, showError } = useToast();
  const [deleteDeckId, setDeleteDeckId] = useState<number | null>(null);
  const [bulkReviewModalOpened, setBulkReviewModalOpened] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);

      const data = await deckService.getMyDecks();

      setDecks(data);
    } catch (error) {
      showError(t('toast.loadError'), t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (deckData: DeckRequest) => {
    try {
      await deckService.create(deckData);
      showSuccess(t('toast.createSuccess'), t('toast.createSuccess'));
      setIsModalOpen(false);
      fetchDecks();
    } catch (error) {
      showError(t('toast.createError'), t('toast.createError'));
    }
  };

  const handleUpdate = async (deckData: DeckRequest) => {
    if (!editingDeck) return;

    try {
      await deckService.update(editingDeck.deckId, deckData);
      showSuccess(t('toast.updateSuccess'), t('toast.updateSuccess'));
      setIsModalOpen(false);
      setEditingDeck(undefined);
      fetchDecks();
    } catch (error) {
      showError(t('toast.updateError'), t('toast.updateError'));
    }
  };

  const handleDelete = (deckId: number) => {
    setDeleteDeckId(deckId);
  };

  const confirmDelete = async () => {
    if (deleteDeckId === null) return;

    try {
      await deckService.delete(deleteDeckId);
      showSuccess(t('toast.deleteSuccess'), t('toast.deleteSuccess'));
      fetchDecks();
    } catch (error) {
      showError(t('toast.deleteError'), t('toast.deleteError'));
    } finally {
      setDeleteDeckId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDeckId(null);
  };

  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeck(undefined);
  };

  const filteredDecks = decks.filter(
    (deck) =>
      deck.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deck.language?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedDecks = [...filteredDecks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (loading) {
    return <Skeleton />;
  }

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
        <PageHeader>
          {/* Hero Section */}
          <div className="pt-4 mb-6 md:mb-8 md:pt-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                  {t('common:navigation.decks')}
                </h1>
                <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                  {t('subtitle')}
                </p>
                {decks.length > 0 && !searchTerm && (
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {decks.length} {decks.length === 1 ? 'deck' : 'decks'}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                {decks.length > 0 && (
                  <Button
                    color="cyan"
                    onClick={() => setBulkReviewModalOpened(true)}
                    size="lg"
                    className="w-full border-none md:w-fit">
                    {t('bulkReview.button')}
                  </Button>
                )}
                <Button
                  onClick={() => setIsModalOpen(true)}
                  size="lg"
                  className="w-full border-none md:w-fit bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                  <HiPlus className="w-5 h-5 mr-2" />
                  {t('createButton')}
                </Button>
              </div>
            </div>
          </div>

          {/* Search & Filter Card */}
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
                {searchTerm && (
                  <p className="flex items-center gap-1 text-xs text-text-muted-light dark:text-text-muted-dark">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
                    {sortedDecks.length} {t('common:search.found')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold tracking-wide uppercase text-text-muted-light dark:text-text-muted-dark">
                  {t('common:sort.label')}
                </label>
                <Select
                  value={sortOrder}
                  onChange={(e) =>
                    setSortOrder(e.target.value as 'newest' | 'oldest')
                  }
                  className="cursor-pointer">
                  <option value="newest">{t('common:sort.newest')}</option>
                  <option value="oldest">{t('common:sort.oldest')}</option>
                </Select>
              </div>
            </div>
          </div>
        </PageHeader>

        <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
          <div className="container px-4 mx-auto max-w-7xl">
            {sortedDecks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {sortedDecks.map((deck) => (
                  <DeckCard
                    key={deck.deckId}
                    deck={deck}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            ) : searchTerm ? (
              <EmptyState
                title={t('empty.noResults')}
                description={t('common:search.otherSearchTerm')}
                buttonOnClick={() => setSearchTerm('')}
                clearButtonText={t('common:search.clearSearch')}
              />
            ) : (
              <div className="py-12 text-center md:py-20">
                <p className="mb-6 text-xl text-text-body-light dark:text-text-muted-dark md:text-2xl">
                  {t('empty.message')}
                </p>
              </div>
            )}
          </div>
        </section>

        <DeckModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingDeck ? handleUpdate : handleCreate}
          deck={editingDeck}
        />

        {/* Bulk Review Modal */}
        <BulkReviewModal
          opened={bulkReviewModalOpened}
          onClose={() => setBulkReviewModalOpened(false)}
          decks={decks}
          classroomId={null}
        />

        {/* Delete Confirmation Modal */}
        <Modal show={deleteDeckId !== null} onClose={cancelDelete} size="md">
          <ModalHeader>{t('common:modals.deleteModal.title')}</ModalHeader>

          <ModalBody>
            <p className="text-text-body-light dark:text-text-muted-dark">
              {t('common:modals.deleteModal.message')}
            </p>
          </ModalBody>

          <ModalFooter>
            <div className="flex justify-end w-full gap-3">
              <Button color="gray" onClick={cancelDelete} size="sm">
                {t('common:actions.cancel')}
              </Button>
              <Button color="red" onClick={confirmDelete} size="sm">
                {t('common:modals.deleteModal.yes')}
              </Button>
            </div>
          </ModalFooter>
        </Modal>

        <NoavaFooter />
      </div>
    </div>
  );
}

export default DecksPage;
