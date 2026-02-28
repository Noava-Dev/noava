import { useEffect, useState } from 'react';
import './App.css';
import AppRoutes from './AppRoutes';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { useLocation } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18next from 'i18next';
import NoavaSidebar from './shared/components/navigation/NoavaSidebar';
import NoavaFooter from './shared/components/navigation/NoavaFooter';
import { Drawer } from 'flowbite-react';
import { HiX } from 'react-icons/hi';
import { RxHamburgerMenu } from 'react-icons/rx';

function App() {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const handleClose = () => setIsSidebarOpen(false);

  const routesWithoutSidebar = [
    '/',
    '/not-found',
    '/faq',
    '/guidelines',
    '/terms-of-service',
    '/privacy',
    '/copyright',
    '/sign-up',
    '/sign-in',
    '/docs',
  ];
  // const showSidebar = !routesWithoutSidebar.includes(location.pathname);
  const showSidebar = !routesWithoutSidebar.some(
    (route) =>
      location.pathname === route || location.pathname.startsWith(route + '/')
  );

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
            <>
              {!isSidebarOpen && (
                <RxHamburgerMenu
                  onClick={() => setIsSidebarOpen(true)}
                  className="absolute z-50 sm:hidden top-4 right-4 size-7 text-text-muted-light dark:text-text-muted-dark"
                />
              )}

              {/* Mobile Sidebar */}
              <div className="flex-shrink-0 sm:hidden">
                <Drawer
                  open={isSidebarOpen}
                  onClose={handleClose}
                  position="left"
                  className="w-full bg-gray-50 h-screen flex flex-col">
                  <div className="flex justify-end p-4 pb-0 flex-shrink-0">
                    <HiX
                      className="size-5 text-text-muted-light dark:text-text-muted-dark"
                      onClick={() => handleClose()}
                    />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <NoavaSidebar
                      className="w-full border-none h-full"
                      onNavigate={handleClose}
                    />
                  </div>
                </Drawer>
              </div>

              {/* Desktop Sidebar */}
              <div className="flex-shrink-0 hidden sm:block">
                <NoavaSidebar />
              </div>
            </>
          )}

          <main className="flex-1 overflow-auto">
            <AppRoutes />
            {!showSidebar && <NoavaFooter />}
          </main>
        </div>
      </I18nextProvider>
    </UserRoleProvider>
  );
}
export default App;
