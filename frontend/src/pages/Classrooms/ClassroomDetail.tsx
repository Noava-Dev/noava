import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import Loading from '../../shared/components/loading/Loading';
import { useClassroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';
import type { ClassroomResponse } from '../../models/Classroom';

function ClassroomDetailPage() {
  const { classroomId } = useParams();
  const id = Number(classroomId);
  const { t } = useTranslation('classrooms');
  const classroomSvc = useClassroomService();
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
              </div>

              {classroom.permissions?.canEdit && (
                <div className="flex-shrink-0">
                  <Button onClick={() => navigate(`/classrooms/${id}/members`)}>
                    {t('members.title')}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </PageHeader>
        <div className="flex items-center gap-3 mt-6">
          <Button color="gray" onClick={() => navigate('/classrooms')}>
            {t('common:actions.back')}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ClassroomDetailPage;
