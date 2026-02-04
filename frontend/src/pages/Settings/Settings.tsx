import {
  LuSun as sun,
  LuMoon as moon,
  LuGlobe as Globe,
  LuMessageCircleQuestion as Question,
  LuChevronDown as ChevronDown,
} from 'react-icons/lu';
import { useState } from 'react';
import PageHeader from '../../shared/components/PageHeader';
import { SettingsGroup } from './components/SettingsGroup';
import { useTranslation } from 'react-i18next';
import { Tooltip, Dropdown, DropdownItem } from 'flowbite-react';
import { useTheme } from '../../contexts/ThemeContext';
import NoavaFooter from '../../shared/components/navigation/NoavaFooter';

function SettingsPage() {
  //-------------------change theme------------------------------
  const { theme, toggleTheme } = useTheme();

  //--------------------change language-----------------------------
  const { t, i18n } = useTranslation('settings');

  const languageLabels: Record<string, string> = {
    en: 'English',
    nl: 'Nederlands',
    fr: 'Français',
  };

  const [language, setLanguage] = useState(
    localStorage.getItem('preferredLanguage') ?? i18n.language
  );

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('preferredLanguage', lang);
    setLanguage(lang);
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-background-app-light dark:bg-background-app-dark">
        <header>
          <PageHeader>
            <div className="flex flex-col gap-2 p-3 text-center">
              <h1 className="text-4xl font-bold text-text-title-light dark:text-text-title-dark">
                {t('common:navigation.settings')}
              </h1>
              <p className="text-text-body-light dark:text-text-body-dark">
                {t('header.subtitle')}
              </p>
            </div>
          </PageHeader>
        </header>

        <div>
          <div className="flex flex-col items-center">
            {/* Theme */}
            <SettingsGroup
              title={t('theme.title')}
              description={t('theme.description')}
              tooltip={t('theme.tooltip')}
              groupIcon={theme === 'dark' ? moon : sun}
              options={[
                {
                  label: t('theme.light'),
                  icon: sun,
                  active: theme === 'light',
                  onClick: () => theme === 'dark' && toggleTheme(),
                },
                {
                  label: t('theme.dark'),
                  icon: moon,
                  active: theme === 'dark',
                  onClick: () => theme === 'light' && toggleTheme(),
                },
              ]}
            />

            {/* Language */}
            <div className="flex justify-between w-1/2 p-6 m-5 border rounded-lg border-border-strong dark:border-border-dark text-text-title-light bg-background-surface-light dark:bg-background-surface-dark dark:text-text-title-dark">
              <div className="flex items-center justify-items-start">
                <div className="flex items-center justify-center text-white border rounded-lg size-10 bg-primary-700 dark:bg-primary-600 border-primary-500">
                  <Globe className="w-6 h-6" />
                </div>
                <div className="flex flex-col m-4">
                  <div className="flex items-center gap-3">
                    <h3>{t('language.title')}</h3>
                    <Tooltip content={t('language.tooltip')}>
                      <Question className="size-4" />
                    </Tooltip>
                  </div>
                  <div>
                    <p className="text-sm text-text-muted-light dark:text-text-muted-dark ">
                      {t('language.description')}
                    </p>
                  </div>
                </div>
              </div>
              <Dropdown
                inline
                renderTrigger={() => (
                  <button className="flex items-center gap-1 px-4 py-2 my-auto text-sm font-medium border rounded-lg h-fit bg-background-app-light dark:bg-background-surface-dark text-text-body-light dark:text-text-body-dark focus:ring-0 focus:outline-none focus:border-border hover:border-border-strong border-border hover:dark:border-border-strong dark:border-border-dark">
                    {languageLabels[language]}
                    <ChevronDown className="w-5 h-5 opacity-70" />
                  </button>
                )}>
                <DropdownItem onClick={() => changeLanguage('en')}>
                  English
                </DropdownItem>
                <DropdownItem onClick={() => changeLanguage('nl')}>
                  Nederlands
                </DropdownItem>
                <DropdownItem onClick={() => changeLanguage('fr')}>
                  Français
                </DropdownItem>
              </Dropdown>
            </div>
          </div>
        </div>
      </div>
      <NoavaFooter />
    </>
  );
}
export default SettingsPage;
