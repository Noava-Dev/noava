import { useEffect } from 'react';

import './App.css';
/* import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/clerk-react'; */
import AppRoutes from './AppRoutes';
import { SidebarNav } from './shared/components/Sidebar';

function App() {
  return (
    <div className="flex h-screen">
      <div>
        <SidebarNav />
      </div>
      <main className="app-container">
        <AppRoutes />
      </main>
    </div>
  );
}

export default App;
