import { useState, useEffect } from 'react';
import {
  Button,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Select,
  Dropdown,
  DropdownItem,
  Tooltip,
} from 'flowbite-react';
import { Modal } from 'flowbite-react';
import {
  HiPlus,
  HiPlay,
  HiPencil,
  HiRefresh,
  HiChevronDown,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../shared/components/PageHeader';
import DeckCard from '../../shared/components/DeckCard';
import DeckModal from '../../shared/components/DeckModal';
import DeckStatisticsModal from '../../shared/components/DeckStatisticsModal';
import { BulkReviewModal } from '../../shared/components/BulkReviewModal';
import Searchbar from '../../shared/components/Searchbar';
import { useDeckService } from '../../services/DeckService';
import { useToast } from '../../contexts/ToastContext';
import type { Deck, DeckRequest } from '../../models/Deck';
import Skeleton from '../../shared/components/loading/Skeleton';
import EmptyState from '../../shared/components/EmptyState';
import { useUser } from '@clerk/clerk-react';
import ConfirmModal from '../../shared/components/ConfirmModal';
import { TbDoorEnter } from 'react-icons/tb';
import { LuLayers } from 'react-icons/lu';

function DecksPage() {
  const { t } = useTranslation('decks');
  const navigate = useNavigate();
  const { user } = useUser();

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
  const [bulkWriteReviewModalOpened, setBulkWriteReviewModalOpened] =
    useState(false);
  const [bulkReverseReviewModalOpened, setBulkReverseReviewModalOpened] =
    useState(false);
  const [joinCodeModalOpen, setJoinCodeModalOpen] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joiningDeck, setJoiningDeck] = useState(false);
  const [analyticsModalOpen, setAnalyticsModalOpen] = useState(false);
  const [analyticsDeck, setAnalyticsDeck] = useState<Deck | null>(null);
  const [copyModalOpened, setCopyModalOpened] = useState(false);
  const [deckToCopy, setDeckToCopy] = useState<number | null>(null);
  const [isCopying, setIsCopying] = useState(false);

  useEffect(() => {
    fetchDecks();
  }, []);

  const fetchDecks = async () => {
    try {
      setLoading(true);

      const data = await deckService.getMyDecks();

      setDecks(data);
    } catch (error) {
      showError(t('toast.loadError'), 'Error');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (deckId: number) => {
    setDeckToCopy(deckId);
    setCopyModalOpened(true);
  };

  const handleConfirmCopy = async () => {
    if (!deckToCopy) return;

    setIsCopying(true);

    try {
      await deckService.copy(deckToCopy);
      showSuccess(t('decks:copySuccess'), t('common:toast.success'));
      await fetchDecks();
    } catch (error) {
      showError(t('common:toast.error'), t('decks:copyError'));
    } finally {
      setIsCopying(false);
      setCopyModalOpened(false);
      setDeckToCopy(null);
    }
  };

  const handleCreate = async (deckData: DeckRequest) => {
    try {
      await deckService.create(deckData);
      showSuccess('Success', t('toast.createSuccess'));
      setIsModalOpen(false);
      fetchDecks();
    } catch (error) {
      showError(t('toast.createError'), 'Error');
    }
  };

  const handleUpdate = async (deckData: DeckRequest) => {
    if (!editingDeck) return;

    try {
      await deckService.update(editingDeck.deckId, deckData);
      showSuccess('Success', t('toast.updateSuccess'));
      setIsModalOpen(false);
      setEditingDeck(undefined);
      fetchDecks();
    } catch (error: any) {
      if (error.response?.status === 404 || error.response?.status === 403) {
        navigate('/not-found', { replace: true });
      } else {
        showError(t('toast.updateError'), 'Error');
      }
    }
  };

  const handleDelete = (deckId: number) => {
    setDeleteDeckId(deckId);
  };

  const confirmDelete = async () => {
    if (deleteDeckId === null) return;

    try {
      await deckService.delete(deleteDeckId);
      showSuccess('Success', t('toast.deleteSuccess'));
      fetchDecks();
    } catch (error: any) {
      showError(t('toast.deleteError'), 'Error');
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

  const handleAnalytics = (deck: Deck) => {
    setAnalyticsDeck(deck);
    setAnalyticsModalOpen(true);
  };

  const handleCloseAnalyticsModal = () => {
    setAnalyticsModalOpen(false);
    setAnalyticsDeck(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeck(undefined);
  };

  const handleJoinByCode = async () => {
    if (!joinCode.trim()) {
      showError(t('joinCode.empty'), t('common:toast.error'));
      return;
    }

    try {
      setJoiningDeck(true);
      await deckService.joinByCode(joinCode.trim());
      showSuccess('Success', t('joinCode.success'));
      setJoinCodeModalOpen(false);
      setJoinCode('');
      fetchDecks();
    } catch (error) {
      showError(t('joinCode.error'), t('common:toast.error'));
    } finally {
      setJoiningDeck(false);
    }
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

  // Split decks into owned and shared
  const ownedDecks = sortedDecks.filter((deck) => deck.userId === user?.id);
  const sharedDecks = sortedDecks.filter((deck) => deck.userId !== user?.id);

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
                  <div className="w-full md:w-fit">
                    <Tooltip content={t('common:tooltips.bulkReview')}>
                      <Dropdown
                        label=""
                        dismissOnClick={true}
                        renderTrigger={() => (
                          <Button
                            size="lg"
                            className="w-full border-none bg-cyan-500 hover:bg-cyan-600 md:w-fit">
                            <HiPlay className="w-5 h-5 mr-2" />
                            {t('bulkReview.button')}
                            <HiChevronDown className="w-4 h-4 ml-1" />
                          </Button>
                        )}>
                        <DropdownItem
                          icon={HiPlay}
                          onClick={() => setBulkReviewModalOpened(true)}>
                          {t('reviewModes.flipMode')}
                        </DropdownItem>
                        <DropdownItem
                          icon={HiPencil}
                          onClick={() => setBulkWriteReviewModalOpened(true)}>
                          {t('reviewModes.writeReview')}
                        </DropdownItem>
                        <DropdownItem
                          icon={HiRefresh}
                          onClick={() => setBulkReverseReviewModalOpened(true)}>
                          {t('reviewModes.reverseReview')}
                        </DropdownItem>
                      </Dropdown>
                    </Tooltip>
                  </div>
                )}
                <div className="w-full md:w-fit">
                  <Tooltip content={t('common:tooltips.joinDeckByCode')}>
                    <Button
                      onClick={() => setJoinCodeModalOpen(true)}
                      size="lg"
                      color="gray"
                      className="w-full border-none md:w-fit">
                      {t('joinCode.button')}
                    </Button>
                  </Tooltip>
                </div>
                <div className="w-full md:w-fit">
                  <Tooltip content={t('common:tooltips.createDeck')}>
                    <Button
                      onClick={() => setIsModalOpen(true)}
                      size="lg"
                      className="w-full border-none md:w-fit bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800">
                      <HiPlus className="w-5 h-5 mr-2" />
                      {t('createButton')}
                    </Button>
                  </Tooltip>
                </div>
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
              <div className="space-y-12">
                {/* My Decks Section */}
                {ownedDecks.length > 0 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-text-title-light dark:text-text-title-dark">
                      {t('sections.myDecks')}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                      {ownedDecks.map((deck) => (
                        <DeckCard
                          key={deck.deckId}
                          deck={deck}
                          onCopy={handleCopy}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onAnalytics={handleAnalytics}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Shared Decks Section */}
                {sharedDecks.length > 0 && (
                  <div>
                    <h2 className="mb-6 text-2xl font-bold text-text-title-light dark:text-text-title-dark">
                      {t('sections.sharedWithMe')}
                    </h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                      {sharedDecks.map((deck) => (
                        <DeckCard
                          key={deck.deckId}
                          deck={deck}
                          onCopy={handleCopy}
                          onAnalytics={handleAnalytics}
                          showEdit={false}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : searchTerm ? (
              <EmptyState
                title={t('empty.noResults')}
                description={t('common:search.otherSearchTerm')}
                icon={LuLayers}
                buttonOnClick={() => setSearchTerm('')}
                clearButtonText={t('common:search.clearSearch')}
              />
            ) : (
              <EmptyState
                title={t('empty.title')}
                description={t('empty.message')}
                icon={LuLayers}
              />
            )}
          </div>
        </section>

        {/* Join by Code Modal */}
        <Modal show={joinCodeModalOpen} onClose={() => setJoinCodeModalOpen(false)} size="md" dismissible>
          <ModalHeader>{t('joinCode.title')}</ModalHeader>
          <ModalBody>
            <div className="space-y-4">
              <p className="text-sm text-text-body-light dark:text-text-muted-dark">
                {t('joinCode.description')}
              </p>
              <div>
                <label className="block mb-2 text-sm font-medium">
                  {t('joinCode.label')}
                </label>
                <input
                  type="text"
                  value={joinCode}
                  onChange={(e) => setJoinCode(e.target.value)}
                  placeholder={t('joinCode.placeholder')}
                  className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleJoinByCode();
                    }
                  }}
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <div className="flex w-full flex-col gap-3 sm:flex-row">
              <Button onClick={handleJoinByCode} disabled={joiningDeck} className="w-full sm:flex-1">
                {joiningDeck ? t('joinCode.joining') : t('joinCode.join')}
              </Button>
              <Button color="gray" onClick={() => setJoinCodeModalOpen(false)} className="w-full sm:w-auto">
                {t('common:actions.cancel')}
              </Button>
            </div>
          </ModalFooter>
        </Modal>

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
          reviewType="flip"
        />

        {/* Bulk Write Review Modal */}
        <BulkReviewModal
          opened={bulkWriteReviewModalOpened}
          onClose={() => setBulkWriteReviewModalOpened(false)}
          decks={decks}
          classroomId={null}
          reviewType="write"
        />

        {/* Bulk Reverse Review Modal */}
        <BulkReviewModal
          opened={bulkReverseReviewModalOpened}
          onClose={() => setBulkReverseReviewModalOpened(false)}
          decks={decks}
          classroomId={null}
          reviewType="reverse"
        />

        {/* Deck Statistics Modal */}
        <DeckStatisticsModal
          show={analyticsModalOpen}
          onClose={handleCloseAnalyticsModal}
          deck={analyticsDeck}
        />

        <ConfirmModal
          show={deleteDeckId !== null}
          title={t('common:modals.deleteModal.title')}
          message={t('common:modals.deleteModal.message')}
          confirmLabel={t('common:modals.deleteModal.yes')}
          cancelLabel={t('common:actions.cancel')}
          confirmColor="red"
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
        />

        {/* Confirm Copy Modal */}
        <ConfirmModal
          show={copyModalOpened}
          title={t('copy.title')}
          message={t('copy.message')}
          confirmLabel={
            isCopying ? t('common:actions.copying') : t('common:actions.copy')
          }
          cancelLabel={t('common:actions.cancel')}
          confirmColor="green"
          onConfirm={handleConfirmCopy}
          onCancel={() => setCopyModalOpened(false)}
        />
      </div>
    </div>
  );
}

export default DecksPage;
