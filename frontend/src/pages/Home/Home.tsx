import Header from '../../shared/components/navigation/Header';
import { Button, Card } from 'flowbite-react';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';
import {
  HiCube,
  HiUserGroup,
  HiViewGrid,
  HiChartBar,
  HiDesktopComputer,
  HiOutlineDeviceMobile,
} from 'react-icons/hi';
import { useTranslation } from 'react-i18next';
import { SignUpButton, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { t } = useTranslation('home');
  const { isSignedIn } = useUser();
  const navigate = useNavigate();

  return (
    <>
      <Header />

      {/* Hero Section */}
      <section className="py-16 bg-background-surface-light dark:bg-background-app-dark">
        <div className="container max-w-4xl px-4 py-16 mx-auto text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl text-text-title-light dark:text-text-title-dark">
            {t('hero.title')}
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg font-normal text-text-body-light dark:text-text-body-dark">
            {t('hero.description')}
          </p>
        </div>
        <div className="flex justify-center">
          {isSignedIn ? (
            <Button onClick={() => navigate('/dashboard')}>
              {t('common:actions.getStarted')}
            </Button>
          ) : (
            <SignUpButton>
              <Button>{t('common:actions.getStarted')}</Button>
            </SignUpButton>
          )}
        </div>
      </section>

      {/* Everything you need Section */}
      <section className="py-16 bg-background-app-light dark:bg-background-surface-dark">
        <div className="container max-w-6xl px-4 py-16 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-text-title-light dark:text-text-title-dark">
              {t('features.title')}
            </h2>
            <p className="text-lg font-normal text-text-body-light dark:text-text-body-dark">
              {t('features.description')}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Decks Card */}
            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 border rounded-lg shrink-0 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <HiCube className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                    {t('features.decks.title')}
                  </h3>
                  <p className="text-sm text-text-body-light dark:text-text-body-dark">
                    {t('features.decks.description')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Classrooms Card */}
            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 border rounded-lg shrink-0 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <HiUserGroup className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                    {t('features.classrooms.title')}
                  </h3>
                  <p className="text-sm text-text-body-light dark:text-text-body-dark">
                    {t('features.classrooms.description')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Dashboards Card */}
            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 border rounded-lg shrink-0 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <HiViewGrid className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                    {t('features.dashboards.title')}
                  </h3>
                  <p className="text-sm text-text-body-light dark:text-text-body-dark">
                    {t('features.dashboards.description')}
                  </p>
                </div>
              </div>
            </Card>

            {/* Analytics Card */}
            <Card>
              <div className="flex items-start space-x-4">
                <div className="p-3 border rounded-lg shrink-0 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <HiChartBar className="w-6 h-6 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="mb-2 text-lg font-semibold text-text-title-light dark:text-text-title-dark">
                    {t('features.analytics.title')}
                  </h3>
                  <p className="text-sm text-text-body-light dark:text-text-body-dark">
                    {t('features.analytics.description')}
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Available everywhere Section */}
      <section className="py-16 bg-background-surface-light dark:bg-background-app-dark">
        <div className="container max-w-6xl px-4 mx-auto">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight md:text-4xl text-text-title-light dark:text-text-title-dark">
              {t('platforms.title')}
            </h2>
            <p className="text-lg font-normal text-text-body-light dark:text-text-body-dark">
              {t('platforms.description')}
            </p>
          </div>

          <div className="grid max-w-2xl grid-cols-1 gap-6 mx-auto md:grid-cols-2">
            {/* Mobile Card */}
            <Card>
              <div className="text-center">
                <div className="inline-flex p-4 mb-4 border rounded-lg bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <HiOutlineDeviceMobile className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-title-light dark:text-text-title-dark">
                  {t('platforms.mobile')}
                </h3>
              </div>
            </Card>

            {/* Desktop Card */}
            <Card>
              <div className="text-center">
                <div className="inline-flex p-4 mb-4 border rounded-lg bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <HiDesktopComputer className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-text-title-light dark:text-text-title-dark">
                  {t('platforms.desktop')}
                </h3>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <NoavaFooter />
    </>
  );
}

export default Home;
