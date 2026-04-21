// frontend/src/App.tsx
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@clerk/clerk-react';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Notes from './pages/Notes';
import { CourseProvider } from './context/CourseContext';
import { registerTokenGetter } from './lib/authFetch';

export default function App() {
  const { getToken, isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    registerTokenGetter(async () => {
      if (!isLoaded || !isSignedIn) return null;
      return await getToken();
    });
  }, [getToken, isLoaded, isSignedIn]);

  return (
    <CourseProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Layout>
    </CourseProvider>
  );
}