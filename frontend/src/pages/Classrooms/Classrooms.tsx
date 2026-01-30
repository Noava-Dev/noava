import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Select } from 'flowbite-react';
import { HiPlus } from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import NoavaFooter from '../../shared/components/NoavaFooter';
import PageHeader from '../../shared/components/PageHeader';
import ClassroomCard from '../../shared/components/ClassroomCard';
import ClassroomModal from '../../shared/components/ClassroomModal';
import Loading from '../../shared/components/Loading';
import Searchbar from '../../shared/components/Searchbar';
import ConfirmModal from '../../shared/components/ConfirmModal';
import RequestCodeModal from '../../shared/components/RequestCodeModal';
import { classroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import type { ClassroomResponse } from '../../models/Classroom';

function ClassroomsPage() {
  const { t } = useTranslation('classrooms');
  const classroomSvc = classroomService();
  const [classrooms, setClassrooms] = useState<ClassroomResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<ClassroomResponse | undefined>(undefined);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az' | 'za'>('az');
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
      showError(t('toast.loadError'), t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (payload: any) => {
    try {
      await classroomSvc.create(payload);
      showSuccess(t('toast.createSuccess'), t('toast.createSuccess'));
      setIsModalOpen(false);
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.createError'), t('toast.createError'));
    }
  };

  const handleUpdate = async (payload: any) => {
    if (!editingClassroom) return;
    try {
      await classroomSvc.update(editingClassroom.id, payload);
      showSuccess(t('toast.updateSuccess'), t('toast.updateSuccess'));
      setIsModalOpen(false);
      setEditingClassroom(undefined);
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.updateError'), t('toast.updateError'));
    }
  };

  const handleDelete = (id: number) => setDeleteId(id);

  const confirmDelete = async () => {
    if (deleteId === null) return;
    try {
      await classroomSvc.delete(deleteId);
      showSuccess(t('toast.deleteSuccess'), t('toast.deleteSuccess'));
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.deleteError'), t('toast.deleteError'));
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
      showSuccess(t('toast.requestCodeSuccess'), t('toast.requestCodeSuccess'));
      fetchClassrooms();
    } catch (error) {
      showError(t('toast.requestCodeError'), t('toast.requestCodeError'));
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

  const filtered = classrooms.filter(c =>
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
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    case 'oldest':
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    default:
      return 0;
  }
});

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="ml-0 flex-1 w-full">
        <PageHeader>
          <div className="mb-6 md:mb-8 pt-4 md:pt-8">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="space-y-2">
                  <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('title')}</h1>
                  <p className="text-base md:text-xl text-gray-500 dark:text-gray-400">{t('subtitle')}</p>
                  {classrooms.length > 0 && !searchTerm && (
                    <p className="text-sm text-gray-400 dark:text-gray-500">{classrooms.length} {classrooms.length === 1 ? 'classroom' : 'classrooms'}</p>
                  )}
                </div>

                <div className="mt-4 md:mt-6">
                  <Button onClick={() => setIsModalOpen(true)} size="lg" className="md:w-fit w-full bg-gradient-to-r from-primary-600 to-primary-700">
                    <HiPlus className="mr-2 h-5 w-5" />
                    {t('createButton')}
                  </Button>
                </div>
              </div>

              <div className="flex items-start">
                <Button onClick={() => navigate('/classrooms/join')} size="md" color="gray" className="w-full sm:w-auto">
                  {t('joinButton', 'Join classroom')}
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_280px] gap-4">
              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{t('search.label')}</label>
                <Searchbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                {searchTerm && <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1"><span className="inline-block w-2 h-2 bg-primary-500 rounded-full"></span>{sorted.length} {t('results.found')}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{t('sort.label')}</label>
                <Select value={sortOrder} onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest' | 'az' | 'za')} className="cursor-pointer">
                  <option value="newest">{t('sort.newest')}</option>
                  <option value="oldest">{t('sort.oldest')}</option>
                  <option value="az">{t('sort.az')}</option>
                  <option value="za">{t('sort.za')}</option>
                </Select>
              </div>
            </div>
          </div>
        </PageHeader>

        <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
          <div className="container mx-auto px-4 max-w-7xl">
            {loading ? (
              <div className="py-20">
                <Loading center size="lg" className="mx-auto" />
              </div>
            ) : (
              (sorted.length > 0) ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {sorted.map(c => (
                    <ClassroomCard key={c.id} classroom={c} onEdit={handleEdit} onDelete={handleDelete} onRequestNewCode={handleRequestNewCode} />
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="text-center py-12 md:py-20">
                  <div className="mb-6">
                    <svg className="w-16 h-16 md:w-24 md:h-24 text-gray-400 dark:text-gray-500 mx-auto opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 dark:text-white text-xl md:text-2xl font-semibold mb-3">{t('empty.noResults')}</p>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">{t('empty.tryAnother')}</p>
                  <Button onClick={() => setSearchTerm('')}>{t('empty.clearSearch')}</Button>
                </div>
              ) : (
                <div className="text-center py-12 md:py-20">
                  <p className="text-gray-500 dark:text-gray-400 text-xl md:text-2xl mb-6">{t('empty.message')}</p>
                </div>
              )
            )}
          </div>
        </section>

        <ClassroomModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={editingClassroom ? handleUpdate : handleCreate} classroom={editingClassroom} />

        <ConfirmModal
          show={deleteId !== null}
          title={t('deleteModal.title')}
          message={t('deleteModal.message')}
          confirmLabel={t('deleteModal.yes')}
          cancelLabel={t('deleteModal.no')}
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
