import { useState } from 'react';
import { Button, Label, TextInput, Card, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import { useClassroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';

export default function JoinClassroom() {
  const { t } = useTranslation('classrooms');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const classroomSvc = useClassroomService();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showError(t('app.error'), t('join.form.empty'));
      return;
    }

    try {
      setLoading(true);
      await classroomSvc.joinByCode(code.trim());
      showSuccess(t('join.success'), t('join.success'));
      navigate('/classrooms');
    } catch (err) {
      showError(t('app.error'), t('join.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-background-app-light dark:bg-background-app-dark">
      <div className="flex-1 w-full ml-0">
        <PageHeader>
          <div className="pt-4 mb-6 md:mb-8 md:pt-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl font-extrabold tracking-tight md:text-5xl text-text-title-light dark:text-text-title-dark">
                  {t('join.title')}
                </h1>
                <p className="text-base text-text-muted-light md:text-xl dark:text-text-muted-dark">
                  {t('join.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </PageHeader>

        <section className="min-h-screen py-8 bg-background-app-light dark:bg-background-app-dark md:py-12">
          <div className="container max-w-3xl px-4 mx-auto">
            <Card>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <div className="block mb-2">
                    <Label htmlFor="joinCode" />
                  </div>
                  <TextInput
                    id="joinCode"
                    placeholder={t('join.form.placeholder', 'e.g. ABC123')}
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center gap-3">
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <>
                        <Spinner aria-hidden size="sm" className="mr-2" />
                        {t('join.form.joining')}
                      </>
                    ) : (
                      t('join.form.submit')
                    )}
                  </Button>
                  <Button color="gray" onClick={() => navigate('/classrooms')}>
                    {t('join.form.cancel')}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </section>

        <NoavaFooter />
      </div>
    </div>
  );
}
