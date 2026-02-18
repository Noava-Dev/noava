import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Dropdown, DropdownItem, Tooltip } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { HiPlus, HiPlay, HiPencil, HiRefresh, HiChevronDown } from 'react-icons/hi';
import PageHeader from '../../shared/components/PageHeader';
import Loading from '../../shared/components/loading/Loading';
import DeckCard from '../../shared/components/DeckCard';
import { AddDeckModal } from '../../shared/components/AddDeckModal';
import { BulkReviewModal } from '../../shared/components/BulkReviewModal';
import ConfirmModal from '../../shared/components/ConfirmModal';
import BackButton from '../../shared/components/navigation/BackButton';
import { useClassroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import type { ClassroomResponse } from '../../models/Classroom';
import type { Deck } from '../../models/Deck';

function ClassroomDetailPage() {
  const { classroomId } = useParams();
  const id = Number(classroomId);
  const { t } = useTranslation('classrooms');
  const classroomSvc = useClassroomService();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [decksLoading, setDecksLoading] = useState(false);
  const [addDeckModalOpened, setAddDeckModalOpened] = useState(false);
  const [bulkReviewModalOpened, setBulkReviewModalOpened] = useState(false);
  const [bulkWriteReviewModalOpened, setBulkWriteReviewModalOpened] = useState(false);
  const [bulkReverseReviewModalOpened, setBulkReverseReviewModalOpened] = useState(false);
  const [deleteModalOpened, setDeleteModalOpened] = useState(false);
  const [deckToDelete, setDeckToDelete] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchClassroom();
    fetchDecks();
  }, [classroomId]);

  const fetchClassroom = async () => {
    try {
      setLoading(true);
      const data = await classroomSvc.getById(id);
      setClassroom(data);
    } catch (error) {
      showError(t('common:toast.error'), t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const fetchDecks = async () => {
    try {
      setDecksLoading(true);
      const data = await classroomSvc.getDecksByClassroom(id);
      setDecks(data);
    } catch (error) {
      console.error('Error loading decks:', error);
      showError(t('common:toast.error'), t('decks.loadError'));
    } finally {
      setDecksLoading(false);
    }
  };

  const handleView = (deckId: number) => {
    navigate(`/decks/${deckId}/cards`, {
      state: {
        from: 'classroom',
        classroomId: id,
        classroomName: classroom?.name
      }
    });
  };

  const handleDelete = (deckId: number) => {
    setDeckToDelete(deckId);
    setDeleteModalOpened(true);
  };

  const handleConfirmDelete = async () => {
    if (!deckToDelete) return;

    setIsDeleting(true);
    setDeleteModalOpened(false);

    try {
      await classroomSvc.removeDeck(id, deckToDelete);
      showSuccess(t('decks.removeSuccess'), t('common:toast.success'));
      await fetchDecks();
    } catch (error) {
      console.error('Error removing deck:', error);
      showError(t('common:toast.error'), t('decks.removeError'));
    } finally {
      setIsDeleting(false);
      setDeckToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpened(false);
    setDeckToDelete(null);
  };

  const handleAddDeckToClassroom = async (deckId: number) => {
    try {
      await classroomSvc.addDeck(id, deckId);
      showSuccess(t('common:toast.success'), t('decks.addSuccess'));
      await fetchDecks();
    } catch (error) {
      console.error('Error adding deck:', error);
      showError(t('common:toast.error'), t('decks.addError'));
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <div className="flex-1 w-full ml-0">
          <PageHeader>
            <div className="pt-4 md:pt-8">
              <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                {t('common:navigation.classrooms')}
              </h1>
            </div>
          </PageHeader>
          <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
            <div className="container px-4 mx-auto max-w-7xl">
              <div className="py-20">
                <Loading center size="lg" />
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  if (!classroom)
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <div className="text-text-title-light dark:text-text-title-dark">
          {t('notFound')}
        </div>
      </div>
    );

return (
  <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
    <div className="flex-1 w-full ml-0">
      <PageHeader>
        <div className="pt-4 md:pt-8">
          <BackButton text={t('common:actions.back')} href="/classrooms" />
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                {classroom.name}
              </h1>
              <p className="max-w-3xl mt-2 text-base text-text-muted-light dark:text-text-muted-dark">
                {classroom.description}
              </p>

              <div className="mt-4">
                <div className="inline-block px-3 py-2 font-mono text-sm rounded-lg text-text-body-light bg-background-surface-light dark:bg-background-surface-dark dark:text-text-body-dark">
                  {t('detail.joinCode')}:{' '}
                  <span className="ml-2 font-semibold">
                    {classroom.joinCode}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-3 mt-6 sm:flex-row">
                {decks.length > 0 && (
                  <Dropdown
                    label=""
                    dismissOnClick={true}
                    renderTrigger={() => (
                      <Button size="lg" className="w-full border-none bg-cyan-500 hover:bg-cyan-600 md:w-fit">
                        <HiPlay className="w-5 h-5 mr-2" />
                        {t('bulkReview.button')}
                        <HiChevronDown className="w-4 h-4 ml-1" />
                      </Button>
                    )}
                  >
                    <DropdownItem
                      icon={HiPlay}
                      onClick={() => setBulkReviewModalOpened(true)}
                    >
                      {t('reviewModes.flipMode')}
                    </DropdownItem>
                    <DropdownItem
                      icon={HiPencil}
                      onClick={() => setBulkWriteReviewModalOpened(true)}
                    >
                      {t('reviewModes.writeReview')}
                    </DropdownItem>
                    <DropdownItem
                      icon={HiRefresh}
                      onClick={() => setBulkReverseReviewModalOpened(true)}
                    >
                      {t('reviewModes.reverseReview')}
                    </DropdownItem>
                  </Dropdown>
                )}
                {classroom.permissions?.canEdit && (
                  <>
                    <Button
                      size="lg"
                      className="w-full md:w-fit"
                      onClick={() => navigate(`/classrooms/${id}/members`)}
                    >
                      {t('members.title')}
                    </Button>
                    <Tooltip content={t('common:tooltips.addDeckToClassroom')}>
                      <Button
                        size="lg"
                        className="w-full md:w-fit"
                        onClick={() => setAddDeckModalOpened(true)}
                      >
                        <HiPlus className="w-5 h-5 mr-2" />
                        {t('decks.addDeck')}
                      </Button>
                    </Tooltip>
                  </>
                )}
              </div>
            </div>

          </div>
        </div>
      </PageHeader>

      <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
        <div className="container px-4 mx-auto max-w-7xl">
          {/* Decks Header */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-text-title-light dark:text-text-title-dark">
              {t('decks.title')} ({decks.length})
            </h2>
          </div>

          {/* Decks Grid / Loading / Empty State */}
          {decksLoading ? (
            <div className="py-20">
              <Loading center size="lg" />
            </div>
          ) : decks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
              {decks.map((deck) => (
                <DeckCard
                  key={deck.deckId}
                  deck={deck}
                  onView={handleView}
                  onDelete={handleDelete}
                  showEdit={false}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 md:py-32">
              <div className="text-center max-w-md">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-background-surface-light dark:bg-background-surface-dark flex items-center justify-center">
                    <HiPlus className="w-12 h-12 text-primary-600 dark:text-primary-400" />
                  </div>
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-text-title-light dark:text-text-title-dark">
                  {t('decks.emptyTitle')}
                </h3>

                {/* Description */}
                <p className="mb-6 text-base text-text-muted-light dark:text-text-muted-dark">
                  {t('decks.emptyDescription')}
                </p>

                {/* CTA Button */}
                {classroom.permissions?.canEdit && (
                  <Button
                    size="lg"
                    className="justify-self-center"
                    onClick={() => setAddDeckModalOpened(true)}
                  >
                    <HiPlus className="w-5 h-5 mr-2" />
                    {t('decks.addFirstDeck')}
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Add Deck Modal */}
      <AddDeckModal
        opened={addDeckModalOpened}
        onClose={() => setAddDeckModalOpened(false)}
        classroomId={id}
        onDeckAdded={() => {
          setAddDeckModalOpened(false);
          fetchDecks();
        }}
        onAddDeck={handleAddDeckToClassroom}
      />

      {/* Bulk Review Modal */}
      <BulkReviewModal
        opened={bulkReviewModalOpened}
        onClose={() => setBulkReviewModalOpened(false)}
        decks={decks}
        classroomId={id}
        reviewType="flip"
      />

      {/* Bulk Write Review Modal */}
      <BulkReviewModal
        opened={bulkWriteReviewModalOpened}
        onClose={() => setBulkWriteReviewModalOpened(false)}
        decks={decks}
        classroomId={id}
        reviewType="write"
      />

      {/* Bulk Reverse Review Modal */}
      <BulkReviewModal
        opened={bulkReverseReviewModalOpened}
        onClose={() => setBulkReverseReviewModalOpened(false)}
        decks={decks}
        classroomId={id}
        reviewType="reverse"
      />

      {/* Confirm Delete Modal */}
      <ConfirmModal
        show={deleteModalOpened}
        title={t('decks.confirmRemoveTitle')}
        message={t('decks.confirmRemoveMessage')}
        confirmLabel={t('decks.confirmRemoveButton')}
        cancelLabel={t('common:actions.cancel')}
        confirmColor="red"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  </div>
);
}

export default ClassroomDetailPage;