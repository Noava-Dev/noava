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

  const routesWithoutSidebar = ['/', '/home', '/faq', '/sign-up', '/sign-in'];
  const showSidebar = !routesWithoutSidebar.includes(location.pathname);

  //-------------- language ---------------------
  useEffect(() => {
    const lang = localStorage.getItem('preferredLanguage') || 'en';
    i18next.changeLanguage(lang);
  }, []);

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
