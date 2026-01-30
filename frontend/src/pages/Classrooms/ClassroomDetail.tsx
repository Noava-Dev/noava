import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import Loading from '../../shared/components/Loading';
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
            showError(t('app.error'), t('toast.loadError'));
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return (
            <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="ml-0 flex-1 w-full">
                    <PageHeader>
                        <div className="pt-4 md:pt-8">
                            <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">{t('title')}</h1>
                        </div>
                    </PageHeader>
                    <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
                        <div className="container mx-auto px-4 max-w-7xl">
                            <div className="py-20">
                                <Loading center size="lg" />
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        );
    }

    if (!classroom) return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 items-center justify-center">
            <div className="text-gray-900 dark:text-white">{t('notFound')}</div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            <div className="ml-0 flex-1 w-full">
                <PageHeader>
                        <div className="pt-4 md:pt-8">
                            <div className="flex items-start justify-between gap-4">
                                <div className="min-w-0 flex-1">
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

                                {classroom.permissions?.canEdit && (
                                    <div className="flex-shrink-0">
                                        <Button onClick={() => navigate(`/classrooms/${id}/members`)}>{t('members.title')}</Button>
                                    </div>
                                )}
                            </div>
                        </div>
                </PageHeader>
                <div className="mt-6 flex items-center gap-3">
                    <Button color="gray" onClick={() => navigate('/classrooms')}>{t('detail.back')}</Button>
                </div>
            </div>
        </div>
    );
}

export default ClassroomDetailPage;
