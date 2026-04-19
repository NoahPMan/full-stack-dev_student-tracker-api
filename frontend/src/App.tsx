// src/App.tsx
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
  const { getToken } = useAuth();

  // Make the Clerk session token available to repository fetch calls
  useEffect(() => {
    registerTokenGetter(getToken);
  }, [getToken]);

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
