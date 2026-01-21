import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { ClerkProvider } from '@clerk/clerk-react';
import 'flowbite';
import { BrowserRouter } from 'react-router-dom';
import { ToastProvider } from './contexts/ToastContext.tsx';
import './i18n';
import { ThemeProvider } from './contexts/ThemeContext.tsx';

// import Clerk publishable key
const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key');
}

createRoot(document.getElementById('root')!).render(
  
  <StrictMode>
    <ClerkProvider 
      publishableKey={PUBLISHABLE_KEY}
      signInUrl={import.meta.env.VITE_CLERK_SIGN_IN_URL}
      signUpUrl={import.meta.env.VITE_CLERK_SIGN_UP_URL}
    >
      <BrowserRouter>  
      <ThemeProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
      </ThemeProvider>
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>

);