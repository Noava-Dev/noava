import { useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { SidebarNav } from './shared/components/Sidebar';
import { useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';

function App() {
  const location = useLocation();

  const routesWithoutSidebar = ['/', '/home', '/faq'];
  const showSidebar = !routesWithoutSidebar.includes(location.pathname);

  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem('theme') || 'light';
      document.documentElement.classList.toggle('dark', theme === 'dark');
    };

    applyTheme();
    window.addEventListener('storage', applyTheme);
    return () => {
      window.removeEventListener('storage', applyTheme);
    };
  }, []);

  //-------------- language ---------------------
  const [language, setLanguage] = useState(() => {
    return (
      localStorage.getItem('preferredLanguage') || i18next.language || 'en'
    );
  });

  useEffect(() => {
    i18next.changeLanguage(language);
    localStorage.setItem('preferredLanguage', language);
  }, [language]);

  return (
    <UserRoleProvider>
      <I18nextProvider i18n={i18next}>
        <div className="flex h-screen">
          {showSidebar && (
            <div>
              <SidebarNav />
            </div>
          )}

          <main className={showSidebar ? 'app-container' : 'w-full'}>
            <AppRoutes />
          </main>
        </div>
      </I18nextProvider>
    </UserRoleProvider>
  );
}
export default App;
