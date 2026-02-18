import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import PageHeader from '../../shared/components/PageHeader';
import ClassroomCard from '../../shared/components/ClassroomCard';
import ClassroomModal from '../../shared/components/ClassroomModal';
import Loading from '../../shared/components/loading/Loading';
import Searchbar from '../../shared/components/Searchbar';
import ConfirmModal from '../../shared/components/ConfirmModal';
import RequestCodeModal from '../../shared/components/RequestCodeModal';
import { useClassroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import type { ClassroomResponse } from '../../models/Classroom';
import { TbDoorEnter } from 'react-icons/tb';
import EmptyState from '../../shared/components/EmptyState';

function ClassroomsPage() {
  const { t } = useTranslation('classrooms');
  const classroomSvc = useClassroomService();
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<
    ClassroomResponse | undefined
  >(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az' | 'za'>(
    'az'
  );
  const { showSuccess, showError } = useToast();
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [requestCodeId, setRequestCodeId] = useState<number | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClassrooms();
  }, []);

  const fetchClassrooms = async () => {
    try {
      setLoading(true);
      const data = await classroomSvc.getAllForUser();
      setClassrooms(data);
    } catch (error) {
      showError(t('toast.loadError'), t('app.error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload: any) => {
    try {
      await classroomSvc.create(payload);
      showSuccess(t('toast.createSuccess'), 'Success');
      setIsModalOpen(false);
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.createError'), t('app.error'));
    }
  };

  const handleUpdate = async (payload: any) => {
    if (!editingClassroom) return;
    try {
      await classroomSvc.update(editingClassroom.id, payload);
      showSuccess(t('toast.updateSuccess'), 'Success');
      setIsModalOpen(false);
      setEditingClassroom(undefined);
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.updateError'), t('app.error'));
    }
  };

  const handleDelete = (id: number) => setDeleteId(id);

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await classroomSvc.delete(deleteId);
      showSuccess(t('toast.deleteSuccess'), 'Success');
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.deleteError'), t('app.error'));
    } finally {
      setDeleteId(null);
    }
  };

  const cancelDelete = () => setDeleteId(null);

  const handleRequestNewCode = (id: number) => setRequestCodeId(id);

  const confirmRequestNewCode = async () => {
    if (requestCodeId === null) return;
    try {
      await classroomSvc.updateJoinCode(requestCodeId);
      showSuccess(t('toast.requestCodeSuccess'), 'Success');
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.requestCodeError'), t('app.error'));
    } finally {
      setRequestCodeId(null);
    }
  };

  const handleEdit = (c: ClassroomResponse) => {
    setEditingClassroom(c);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingClassroom(undefined);
  };

  const filtered = classrooms.filter(
    (c) =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sorted = [...filtered].sort((a, b) => {
    switch (sortOrder) {
      case 'az':
        return a.name.localeCompare(b.name, undefined, { sensitivity: 'base' });
      case 'za':
        return b.name.localeCompare(a.name, undefined, { sensitivity: 'base' });
      case 'newest':
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case 'oldest':
        return (
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      default:
        return 0;
    }
  });

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
        <PageHeader>
          <div className="pt-4 mb-6 md:mb-8 md:pt-8">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="space-y-2">
                  <h1 className="text-3xl font-extrabold tracking-tight text-text-title-light md:text-5xl dark:text-text-title-dark">
                    {t('common:navigation.classrooms')}
                  </h1>
                  <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                    {t('subtitle')}
                  </p>
                  {classrooms.length > 0 && !searchTerm && (
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                      {classrooms.length}{' '}
                      {classrooms.length === 1 ? 'classroom' : 'classrooms'}
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3 mt-4 mb-8 md:flex-row md:justify-between md:items-start md:mt-6">
                  {/* Create Classroom */}
                  <Button
                    onClick={() => setIsModalOpen(true)}
                    size="lg"
                    className="w-full md:w-fit bg-gradient-to-r from-primary-600 to-primary-700">
                    <HiPlus className="mr-2 size-5" />
                    {t('createButton')}
                  </Button>

                  {/* Join Classroom */}
                  <Button
                    onClick={() => navigate('/classrooms/join')}
                    size="lg"
                    className="w-full md:w-fit bg-gradient-to-r from-secondary-600 to-secondary-700 hover:shadow-sm hover:border-border">
                    <TbDoorEnter className="mr-2 size-5" />
                    {t('joinButton')}
                  </Button>
                </div>
              </div>
            </div>
          </div>

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
                  <p className="flex items-center gap-1 text-xs text-text-body-light dark:text-text-body-dark">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary-500"></span>
                    {sorted.length} {t('common:search.found')}
                  </p>
                )}
              </div>

              <div className="space-y-2">
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
              </div>
            </div>
          </div>
        </PageHeader>

        <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
          <div className="container px-4 mx-auto max-w-7xl">
            {loading ? (
              <div className="py-20">
                <Loading center size="lg" className="mx-auto" />
              </div>
            ) : sorted.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:gap-6">
                {sorted.map((c) => (
                  <ClassroomCard
                    key={c.id}
                    classroom={c}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onRequestNewCode={handleRequestNewCode}
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

        <ClassroomModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSubmit={editingClassroom ? handleUpdate : handleCreate}
          classroom={editingClassroom}
        />

        <ConfirmModal
          show={deleteId !== null}
          title={t('common:modals.deleteModal.title')}
          message={t('common:modals.deleteModal.message')}
          confirmLabel={t('common:modals.deleteModal.yes')}
          cancelLabel={t('common:actions.cancel')}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          size="md"
        />

        <RequestCodeModal
          show={requestCodeId !== null}
          onConfirm={confirmRequestNewCode}
          onCancel={() => setRequestCodeId(null)}
        />

        <NoavaFooter />
      </div>
    </div>
  );
}

export default ClassroomsPage;
