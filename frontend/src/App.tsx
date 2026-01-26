import './App.css';
import AppRoutes from './AppRoutes';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { SidebarNav } from './shared/components/Sidebar';
import { useLocation } from 'react-router-dom';

function App() {
const location = useLocation();
  
  
  const routesWithoutSidebar = ['/', '/home', '/faq'];
  const showSidebar = !routesWithoutSidebar.includes(location.pathname);

  useEffect(() => {
    const applyTheme = () => {
      const theme = localStorage.getItem("theme") || "light";
      document.documentElement.classList.toggle("dark", theme === "dark");
    };

    applyTheme();
    window.addEventListener("storage", applyTheme)
    return () => {
      window.removeEventListener("storage", applyTheme)
    }
  }, [])

  return (
    <UserRoleProvider>
      <div className="flex h-screen">
        
        {showSidebar && (
          <div>
            <SidebarNav />
          </div>
        )}

        <main className={showSidebar ? "app-container" : "w-full"}>
          <AppRoutes />
        </main>
      </div>
    </UserRoleProvider>
  );
}
export default App;