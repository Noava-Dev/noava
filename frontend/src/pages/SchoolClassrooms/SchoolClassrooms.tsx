import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from 'flowbite-react';
import { 
    LuGraduationCap as Cap,
    LuPlus as Plus } 
from "react-icons/lu";

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

export default function SchoolClassroomsPage() {
    const { id } = useParams<{ id: string }>();
    const schoolId = Number(id);
    
    const { t } = useTranslation(['classrooms', 'common']);
    const schoolService = useSchoolService();
    const classroomService = useClassroomService();
    const { showError, showSuccess } = useToast();

    const [loading, setLoading] = useState(true);
    const [school, setSchool] = useState<SchoolDto | null>(null);
    const [classrooms, setClassrooms] = useState<SchoolClassroomDto[]>([]);

    const totalStudents = classrooms.reduce((acc, curr) => acc + (curr.studentCount || 0), 0);
    const totalDecks = classrooms.reduce((acc, curr) => acc + (curr.deckCount || 0), 0);
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClassroom, setEditingClassroom] = useState<ClassroomResponse | undefined>(undefined);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [requestCodeId, setRequestCodeId] = useState<number | null>(null);

    const fetchData = async () => {
        if (!schoolId) return;
        setLoading(true);
        try {
            const [schoolData, classroomData] = await Promise.all([
                schoolService.getById(schoolId),
                schoolService.getAllClassrooms(schoolId)
            ]);
            setSchool(schoolData);
            setClassrooms(classroomData);
        } catch (error) {
            showError(t('common:app.error'), t('classrooms:toast.loadError'));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [schoolId]);

    const handleSubmitClassroom = async (data: { name: string; description: string }) => {
        try {
            if (editingClassroom) {
                await classroomService.update(editingClassroom.id, data);
                showSuccess(t('common:app.success'), t('classrooms:toast.updateSuccess'));
            } else {
                await schoolService.createClassroom(schoolId, data);
                showSuccess(t('common:app.success'), t('classrooms:toast.createSuccess'));
            }
            handleCloseModal();
            await fetchData();
        } catch (error) {
            showError(t('common:app.error'), editingClassroom ? t('classrooms:toast.updateError') : t('classrooms:toast.createError'));
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
            showSuccess(t('common:app.success'), t('classrooms:toast.requestCodeSuccess'));
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background-app-light dark:bg-background-app-dark">
                <Loading size="lg" center text={t('common:actions.loading')} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background-app-light dark:bg-background-app-dark">
            <PageHeader>
                <div className="flex flex-col gap-6 pt-4 md:flex-row md:items-center md:justify-between md:pt-8">
                    <div className="flex items-center gap-5">
                        <div className="flex items-center justify-center rounded-2xl bg-primary-600 size-14 md:size-16 shadow-lg shadow-primary-500/20">
                            <Cap className="text-white size-8 md:size-10" />
                        </div>
                        <div className="space-y-1">
                            <h1 className="text-2xl font-extrabold tracking-tight text-text-title-light md:text-4xl dark:text-text-title-dark">
                                {school?.schoolName}
                            </h1>
                            <p className="text-sm font-medium md:text-base text-text-muted-light dark:text-text-muted-dark">
                                {classrooms.length} {t('common:navigation.classrooms')} • {totalStudents} {t('common:students')} • {totalDecks} {t('common:navigation.decks')}
                            </p>
                        </div>
                    </div>

                    <Button 
                        onClick={() => setIsModalOpen(true)}
                        size="lg"
                        className="bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800"
                    >
                        <Plus className="mr-2 size-5" />
                        {t('classrooms:createButton')}
                    </Button>
                </div>
            </PageHeader>

            <main className="container px-4 py-8 mx-auto max-w-7xl md:py-12">
                <div className="mb-8 border-b border-border dark:border-border-dark pb-4">
                    <h2 className="text-xl font-bold text-text-title-light dark:text-text-title-dark md:text-2xl">
                        {t('common:navigation.classrooms')}
                    </h2>
                    <p className="text-text-body-light dark:text-text-body-dark">
                        {t('classrooms:subtitle')}
                    </p>
                </div>

                {classrooms.length === 0 ? (
                    <div className="py-20 text-center">
                        <p className="text-xl text-text-muted-light dark:text-text-muted-dark">
                            {t('classrooms:empty.message')}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {classrooms.map((classroom) => (
                            <ClassroomCard
                                key={classroom.classroomId}
                                classroom={{
                                    id: classroom.classroomId,
                                    name: classroom.name,
                                    description: classroom.description ?? '',
                                    createdAt: new Date().toISOString(),
                                    updatedAt: new Date().toISOString(),
                                    joinCode: '',
                                    permissions: { canEdit: true, canDelete: true }
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