import './App.css';
import AppRoutes from './AppRoutes';
import { UserRoleProvider } from './contexts/UserRoleContext';
import { SidebarNav } from './shared/components/Sidebar';

function App() {
  return (
    <UserRoleProvider>
      <div className="flex h-screen">
        <div>
          <SidebarNav />
        </div>

        <main className="app-container">
          <AppRoutes />
        </main>
      </div>
    </UserRoleProvider>
  );
}

export default App;