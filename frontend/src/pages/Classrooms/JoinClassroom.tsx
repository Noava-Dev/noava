import { useState } from 'react';
import { Button, Label, TextInput, Card, Spinner } from 'flowbite-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PageHeader from '../../shared/components/PageHeader';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import { classroomService } from '../../services/ClassroomService';
import { useToast } from '../../contexts/ToastContext';

export default function JoinClassroom() {
  const { t } = useTranslation('classrooms');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const classroomSvc = classroomService();
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
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="ml-0 flex-1 w-full">
        <PageHeader>
          <div className="mb-6 md:mb-8 pt-4 md:pt-8">
            <div className="flex flex-col gap-4 md:gap-6">
              <div className="space-y-2">
                <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                  {t('join.title')}
                </h1>
                <p className="text-base md:text-xl text-gray-500 dark:text-gray-400">
                  {t('join.subtitle')}
                </p>
              </div>
            </div>
          </div>
        </PageHeader>

        <section className="bg-white dark:bg-gray-900 py-8 md:py-12 min-h-screen">
          <div className="container mx-auto px-4 max-w-3xl">
            <Card>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <div className="mb-2 block">
                    <Label htmlFor="joinCode" />
                  </div>
                  <TextInput
                    id="joinCode"
                    placeholder={t('join.form.placeholder', 'Bijv. ABC123')}
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
