import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button, Select } from 'flowbite-react';
import { useUser } from '@clerk/clerk-react';
import { useUserRole } from '../../hooks/useUserRole';
import { LuUsers, LuPlus as Plus } from 'react-icons/lu';

import PageHeader from '../../shared/components/PageHeader';
import ClassroomCard from '../../shared/components/ClassroomCard';
import ClassroomModal from '../../shared/components/ClassroomModal';
import Loading from '../../shared/components/loading/Loading';
import ConfirmModal from '../../shared/components/ConfirmModal';
import RequestCodeModal from '../../shared/components/RequestCodeModal';

import { useSchoolService } from '../../services/SchoolService';
import { useClassroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import { SchoolDto, SchoolClassroomDto } from '../../models/School';
import { ClassroomResponse } from '../../models/Classroom';
import Searchbar from '../../shared/components/Searchbar';
import EmptyState from '../../shared/components/EmptyState';

export default function SchoolClassroomsPage() {
  const { id } = useParams<{ id: string }>();
  const schoolId = Number(id);

  const { t } = useTranslation(['classrooms', 'common']);
  const schoolService = useSchoolService();
  const classroomService = useClassroomService();
  const { showError, showSuccess } = useToast();
  const { user } = useUser();
  const { userRole } = useUserRole();

  const [loading, setLoading] = useState(true);
  const [school, setSchool] = useState<SchoolDto | null>(null);
  const [classrooms, setClassrooms] = useState<SchoolClassroomDto[]>([]);

  const totalStudents = (classrooms ?? []).reduce(
    (acc, curr) => acc + (curr?.studentCount || 0),
    0
  );
  const totalDecks = (classrooms ?? []).reduce(
    (acc, curr) => acc + (curr?.deckCount || 0),
    0
  );

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClassroom, setEditingClassroom] = useState<
    ClassroomResponse | undefined
  >(undefined);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [requestCodeId, setRequestCodeId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'az' | 'za'>(
    'az'
  );

  const canManageSchool =
    userRole === 'ADMIN' ||
    school?.admins?.some((admin) => admin.clerkId === user?.id);

  const fetchData = async () => {
    if (!schoolId) return;
    setLoading(true);
    try {
      const [schoolData, classroomData] = await Promise.all([
        schoolService.getById(schoolId),
        schoolService.getAllClassrooms(schoolId),
      ]);
      setSchool(schoolData);
      setClassrooms(classroomData);
    } catch (error) {
      showError(t('classrooms:toast.loadError'), t('common:app.error'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [schoolId]);

  const handleSubmitClassroom = async (data: {
    name: string;
    description: string;
  }) => {
    try {
      if (editingClassroom) {
        await classroomService.update(editingClassroom.id, data);
        showSuccess(
          t('common:app.success'),
          t('classrooms:toast.updateSuccess')
        );
      } else {
        await schoolService.createClassroom(schoolId, data);
        showSuccess(
          t('common:app.success'),
          t('classrooms:toast.createSuccess')
        );
      }
      handleCloseModal();
      await fetchData();
    } catch (error) {
      showError(
        t('common:app.error'),
        editingClassroom
          ? t('classrooms:toast.updateError')
          : t('classrooms:toast.createError')
      );
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await classroomService.delete(deleteId);
      showSuccess(t('common:app.success'), t('classrooms:toast.deleteSuccess'));
      await fetchData();
    } catch (error) {
      showError(t('common:app.error'), t('classrooms:toast.deleteError'));
    } finally {
      setDeleteId(null);
    }
  };

  const confirmRequestNewCode = async () => {
    if (!requestCodeId) return;
    try {
      await classroomService.updateJoinCode(requestCodeId);
      showSuccess(
        t('common:app.success'),
        t('classrooms:toast.requestCodeSuccess')
      );
      await fetchData();
    } catch (error) {
      showError(t('common:app.error'), t('classrooms:toast.requestCodeError'));
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

  const filtered = classrooms?.filter(
    (c) =>
      c?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c?.description?.toLowerCase().includes(searchTerm.toLowerCase())
  ) ?? [];

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
        <Loading size="lg" center text={t('common:app.loading')} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <PageHeader>
        <div className="flex flex-col gap-6 pt-4 md:flex-row md:items-center md:justify-between md:pt-8">
          <div className="flex items-center gap-5">
            <div className="space-y-1">
              <h1 className="text-3xl font-extrabold text-text-title-light md:text-5xl dark:text-text-title-dark">
                {school?.schoolName}
              </h1>
              <p className="text-base text-text-body-light md:text-xl dark:text-text-body-dark">
                {t('subtitle')}
              </p>
              <p className="text-sm text-text-muted-light">
                {classrooms.length} {t('common:navigation.classrooms')} •{' '}
                {totalStudents} {t('common:students')} • {totalDecks}{' '}
                {t('common:navigation.decks')}
              </p>
            </div>
          </div>

          {canManageSchool && (
            <Button onClick={() => setIsModalOpen(true)} size="lg">
              <Plus className="mr-2 size-5" />
              {t('classrooms:createButton')}
            </Button>
          )}
        </div>
        <div className="p-4 my-5 border shadow-sm border-border bg-background-app-light dark:bg-background-surface-dark rounded-2xl md:p-6 dark:border-border-dark">
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

      <main className="container px-4 py-8 mx-auto max-w-7xl md:py-12">
        {!classrooms || classrooms.length === 0 ? (
          <EmptyState
            title={t('classrooms:empty.title')}
            description={t('classrooms:empty.messageSchools')}
            icon={LuUsers}
          />
        ) : sorted.length === 0 ? (
          <EmptyState
            title={t('classrooms:empty.noResults')}
            description={t('common:search.otherSearchTerm')}
            buttonOnClick={() => setSearchTerm('')}
            clearButtonText={t('common:search.clearSearch')}
          />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {sorted.map((classroom) => (
              <ClassroomCard
                key={classroom.classroomId}
                classroom={{
                  id: classroom.classroomId,
                  name: classroom.name,
                  description: classroom.description ?? '',
                  createdAt: classroom.createdAt,
                  updatedAt: classroom.updatedAt,
                  joinCode: '',
                  coverImageBlobName: classroom.coverImageBlobName ?? null,
                  permissions: { canEdit: true, canDelete: true },
                }}
                onEdit={handleEdit}
                onDelete={(id) => setDeleteId(id)}
                onRequestNewCode={(id) => setRequestCodeId(id)}
              />
            ))}
          </div>
        )}
      </main>

      <ClassroomModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSubmitClassroom}
        classroom={editingClassroom}
      />

      <ConfirmModal
        show={deleteId !== null}
        title={t('common:modals.deleteModal.title')}
        message={t('common:modals.deleteModal.message')}
        confirmLabel={t('common:modals.deleteModal.yes')}
        cancelLabel={t('common:actions.cancel')}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />

      <RequestCodeModal
        show={requestCodeId !== null}
        onConfirm={confirmRequestNewCode}
        onCancel={() => setRequestCodeId(null)}
      />
    </div>
  );
}
