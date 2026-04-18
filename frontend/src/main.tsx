import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ClerkProvider } from '@clerk/clerk-react';
import App from './App';
import './index.css';

const publishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
  <ClerkProvider publishableKey={ publishableKey } >
  <BrowserRouter>
  <App />
  </BrowserRouter>
  </ClerkProvider>
</StrictMode>
);