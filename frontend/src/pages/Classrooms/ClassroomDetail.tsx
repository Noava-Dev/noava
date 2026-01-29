import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import NoavaFooter from '../../shared/components/NoavaFooter';
import { classroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import type { ClassroomResponse } from '../../models/Classroom';
import ClassroomModal from '../../shared/components/ClassroomModal';

function ClassroomDetailPage() {
  const { classroomId } = useParams();
  const id = Number(classroomId);
  const { t } = useTranslation('classrooms');
  const classroomSvc = classroomService();
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();

  const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetchClassroom();
  }, [classroomId]);

  const fetchClassroom = async () => {
    try {
      setLoading(true);
      const data = await classroomSvc.getById(id);
      setClassroom(data);
    } catch (error) {
      showError(t('toast.loadError'), t('toast.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async (payload: any) => {
    if (!classroom) return;
    try {
      await classroomSvc.update(classroom.id, payload);
      showSuccess(t('toast.updateSuccess'), t('toast.updateSuccess'));
      setIsEditOpen(false);
      fetchClassroom();
    } catch (error) {
      showError(t('toast.updateError'), t('toast.updateError'));
    }
  };

  const handleDelete = async () => {
    if (!classroom) return;
    try {
      await classroomSvc.delete(classroom.id);
      showSuccess(t('toast.deleteSuccess'), t('toast.deleteSuccess'));
      navigate('/classrooms');
    } catch (error) {
      showError(t('toast.deleteError'), t('toast.deleteError'));
    }
  };

  if (loading) return <div className="min-h-screen" />;

  if (!classroom) return <div className="min-h-screen">{t('notFound')}</div>;

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="ml-0 flex-1 w-full">
        <PageHeader>
          <div className="pt-4 md:pt-8">
            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{classroom.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">{classroom.joinCode}</p>
          </div>
        </PageHeader>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow">
            <h2 className="text-lg font-semibold mb-2">{t('detail.description')}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">{classroom.description}</p>

            <div className="flex gap-3">
              {classroom.permissions.canEdit && (
                <Button onClick={() => setIsEditOpen(true)}>{t('detail.edit')}</Button>
              )}
              {classroom.permissions.canDelete && (
                <Button color="red" onClick={() => setDeleteOpen(true)}>{t('detail.delete')}</Button>
              )}
              <Button color="gray" onClick={() => navigate('/classrooms')}>{t('detail.back')}</Button>
            </div>
          </div>
        </main>

        <ClassroomModal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} onSubmit={handleUpdate} classroom={classroom} />

        <Modal show={deleteOpen} onClose={() => setDeleteOpen(false)} size="md">
          <ModalHeader>{t('deleteModal.title')}</ModalHeader>
          <ModalBody>
            <p className="text-gray-600 dark:text-gray-400">{t('deleteModal.message')}</p>
          </ModalBody>
          <ModalFooter>
            <div className="flex justify-end gap-3 w-full">
              <Button color="gray" onClick={() => setDeleteOpen(false)} size="sm">{t('deleteModal.no')}</Button>
              <Button color="red" onClick={handleDelete} size="sm">{t('deleteModal.yes')}</Button>
            </div>
          </ModalFooter>
        </Modal>

        <NoavaFooter />
      </div>
    </div>
  );
}

export default ClassroomDetailPage;
