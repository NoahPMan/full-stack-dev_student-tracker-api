import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
     <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <App />
      </ClerkProvider>
    </BrowserRouter>
  </StrictMode>
);