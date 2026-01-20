import { useEffect } from 'react';

import './App.css';
/* import {
  SignedIn,
  SignedOut,
  UserButton,
  SignInButton,
} from '@clerk/clerk-react'; */
import AppRoutes from './AppRoutes';

function App() {

  console.log(import.meta.env.VITE_API_BASE_URL);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => console.log(data.status))
      .catch(console.error);
  }, []);

  return (
    
    <>
    <div className="app-container">
    <AppRoutes />
      {/* <header>
        
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </header> */}
    </div>
    </>
  );
}

export default App;
