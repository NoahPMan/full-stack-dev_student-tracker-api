import { useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { registerTokenGetter } from './authFetch';

export default function TokenBridge() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    registerTokenGetter(async () => {
      if (!isLoaded || !isSignedIn) return null;
      return await getToken();
    });
  }, [getToken, isLoaded, isSignedIn]);

  return null;
}