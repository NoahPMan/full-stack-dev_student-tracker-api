import Layout from './components/Layout';
import { useCourses } from './context/CourseContext';
import './App.css';

function App() {
  const { courses, addCourse } = useCourses();

  const handleTest = () => {
    addCourse({
      code: 'TEST101',
      name: 'Test Course',
      credits: 3
    });
  };

  return (
    <Layout>
      <div className="app-content">
        <h2>Welcome to Student Tracker</h2>
        <p>Manage your courses, assignments, and grades all in one place.</p>
        <button onClick={handleTest}>Add Test Course</button>
        <p>Courses in state: {courses.length}</p>
      </div>
    </Layout>
  );
}

export default App;