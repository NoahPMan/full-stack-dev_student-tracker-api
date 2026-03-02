import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Assignments from './pages/Assignments';
import Notes from './pages/Notes';
import { CourseProvider } from './context/CourseContext';

export default function App() {
  return (
    <CourseProvider>
    <Layout>
    <Routes>
    <Route path= "/" element = {< Home />} />
      < Route path = "/courses" element = {< Courses />} />
        < Route path = "/assignments" element = {< Assignments />} />
          < Route path = "/notes" element = {< Notes />} />
            </Routes>
            </Layout>
            </CourseProvider>
  );
}