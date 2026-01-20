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

  console.log(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => console.log(data.status))
      .catch(console.error);
  }, []);

  // removed the previous layout so the sidebar is always visible and fixed
  // rest of the previous code were placeholders for authentication
  return (
  <div className="flex h-screen">
    <SidebarNav />
    <main className="flex-1 overflow-auto">
      <AppRoutes />
    </main>
  </div>
);

}

export default App;
