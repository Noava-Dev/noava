import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import NoavaFooter from '../../shared/components/NoavaFooter';
import { classroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import type { ClassroomResponse } from '../../models/Classroom';

function ClassroomDetailPage() {
    const { classroomId } = useParams();
    const id = Number(classroomId);
    const { t } = useTranslation('classrooms');
    const classroomSvc = classroomService();
    const navigate = useNavigate();
    const { showError } = useToast();

    const [classroom, setClassroom] = useState<ClassroomResponse | null>(null);
    const [loading, setLoading] = useState(true);

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


    if (loading) return <div className="min-h-screen" />;

    if (!classroom) return <div className="min-h-screen">{t('notFound')}</div>;

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="ml-0 flex-1 w-full">
                <PageHeader>
                    <div className="pt-4 md:pt-8">
                        <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{classroom.name}</h1>
                        <p className="text-base text-gray-600 dark:text-gray-300 mt-2 max-w-3xl">
                            {classroom.description}
                        </p>

                        <div className="mt-4">
                            <div className="inline-block bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 font-mono text-sm text-gray-800 dark:text-gray-100">
                                {t('detail.joinCode')}: <span className="ml-2 font-semibold">{classroom.joinCode}</span>
                            </div>
                        </div>
                    </div>
                </PageHeader>
                <div className="mt-6 flex justify-start">
                    <Button color="gray" onClick={() => navigate('/classrooms')}>{t('detail.back')}</Button>
                </div>
                <NoavaFooter />
            </div>
        </div>
    );
}

export default ClassroomDetailPage;
