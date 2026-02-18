import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import DashboardStatCard from './components/DashboardStatCard';
import {
  LuBrain,
  LuClock,
  LuLayers,
  LuTarget,
  LuTrendingUp,
} from 'react-icons/lu';
import {
  Button,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
} from 'flowbite-react';
import { HiChevronRight } from 'react-icons/hi';
import { useNavigate } from 'react-router-dom';
import { useDeckService } from '../../services/DeckService';
import { useStatisticsService } from '../../services/StatisticsService';
import { formatDateToEuropean } from '../../services/DateService';
import type { DeckRequest, Deck } from '../../models/Deck';
import type { DashboardStatistics } from '../../models/Statistics';
import { useEffect, useState } from 'react';
import { useToast } from '../../contexts/ToastContext';
import DeckCard from '../../shared/components/DeckCard';
import Loading from '../../shared/components/loading/Loading';
import DeckModal from '../../shared/components/DeckModal';

function Dashboard() {
  const { t } = useTranslation('dashboard');
  const navigate = useNavigate();
  const deckService = useDeckService();
  const statisticsService = useStatisticsService();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [statistics, setStatistics] = useState<DashboardStatistics>({} as DashboardStatistics);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeck, setEditingDeck] = useState<Deck | undefined>(undefined);
  const [deleteDeckId, setDeleteDeckId] = useState<number | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [decksData, statsData] = await Promise.all([
        deckService.getMyDecks(4),
        statisticsService.getGeneralStatistics(),
      ]);
      setDecks(decksData);
      setStatistics(statsData);
    } catch (error) {
      showError(t('toast.loadError'), t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (deck: Deck) => {
    setEditingDeck(deck);
    setIsModalOpen(true);
  };

  const handleUpdate = async (deckData: DeckRequest) => {
    if (!editingDeck) return;

    try {
      await deckService.update(editingDeck.deckId, deckData);
      showSuccess(t('toast.updateSuccess'), t('toast.updateSuccess'));
      setIsModalOpen(false);
      setEditingDeck(undefined);
      fetchData();
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
      fetchData();
    } catch (error) {
      showError(t('toast.deleteError'), t('toast.deleteError'));
    } finally {
      setDeleteDeckId(null);
    }
  };

  const cancelDelete = () => {
    setDeleteDeckId(null);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeck(undefined);
  };

  return (
    <>
      <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <div className="flex-1 w-full ml-0">
          <PageHeader>
            {/* Hero Section */}
            <div className="pt-4 mb-6 md:mb-8 md:pt-8">
              <div className="flex flex-col gap-4 md:gap-6">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                    {t('common:navigation.dashboard')}
                  </h1>
                  <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                    {t('subtitle')}
                  </p>
                </div>
              </div>
            </div>
          </PageHeader>

          <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
            {loading ? (
              <Loading size="xl" color="info" center />
            ) : (
              <div className="container flex flex-col gap-6 px-4 mx-auto max-w-7xl">
                {/* Stat Cards */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <DashboardStatCard
                    title={t('statcard.cardsreviewed.title')}
                    value={statistics.cardsReviewed.toString()}
                    tooltip={t('statcard.cardsreviewed.tooltip')}
                    icon={LuBrain}
                  />
                  <DashboardStatCard
                    title={t('statcard.accuracyrate.title')}
                    value={`${Math.round(statistics.accuracyRate)}%`}
                    tooltip={t('statcard.accuracyrate.tooltip')}
                    icon={LuTarget}
                  />
                  <DashboardStatCard
                    title={t('statcard.studytime.title')}
                    value={`${statistics.timeSpentHours}h`}
                    tooltip={t('statcard.studytime.tooltip')}
                    icon={LuClock}
                  />
                  <DashboardStatCard
                    title={t('statcard.lastreview.title')}
                    value={statistics?.lastRevieweDate ? formatDateToEuropean(statistics.lastRevieweDate) : t('statcard.lastreview.never')}
                    tooltip={t('statcard.lastreview.tooltip')}
                    icon={LuTrendingUp}
                  />
                </div>

                {/* Your Decks */}
                <div className="w-3/5">
                  <div className="flex flex-row items-center justify-between">
                    {/* Header */}
                    <h3 className="text-lg font-semibold">{t('yourDecks')}</h3>
                    <Button
                      color="alternative"
                      className="p-0 text-sm border-0 outline-none text-text-muted-light dark:text-text-muted-dark focus:outline-none active:outline-none focus:ring-0 active:ring-0 hover:text-text-body-light dark:hover:text-text-body-dark"
                      onClick={() => navigate('/decks')}
                      outline>
                      {t('common:actions.viewAll')}
                      <HiChevronRight className="size-4" />
                    </Button>
                  </div>

                  {/* Decks (Max 4) */}
                  {decks.length > 0 ? (
                    <div className="grid grid-cols-1 gap-4 py-3 sm:grid-cols-2 md:gap-6">
                      {decks.map((deck) => (
                        <DeckCard
                          key={deck.deckId}
                          deck={deck}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                        />
                      ))}
                    </div>
                  ) : (
                    // No decks yet
                    <div className="flex flex-col items-center justify-center gap-2 mt-4">
                      <LuLayers className="w-10 h-10 text-text-muted-light dark:text-text-muted-dark" />
                      <p className="mb-3 text-xl font-semibold text-text-body-light dark:text-text-body-dark">
                        {t('decks.empty')}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </section>

          {/* Modal */}
          <DeckModal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            onSubmit={handleUpdate}
            deck={editingDeck}
          />

          {/* Delete Confirmation Modal */}
          <Modal show={deleteDeckId !== null} onClose={cancelDelete} size="md">
            <ModalHeader>{t('common:modals.deleteModal.title')}</ModalHeader>

            <ModalBody>
              <p className="text-text-body-light dark:text-text-body-dark">
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
        </div>
      </div>
    </>
  );
}

export default Dashboard;
