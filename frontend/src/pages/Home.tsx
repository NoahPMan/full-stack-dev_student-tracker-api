import { useEffect, useState } from 'react';
import { useAuth } from '@clerk/clerk-react';
import CourseSelector from '../components/CourseSelector';

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor?: string;
  semester?: string;
}

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API}/api/v1/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;

        // Accept either: [...] OR { success: true, data: [...] }
        const list = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(list)) setCourses(list);
      })
      .catch(() => {
        // ignore for now; you can set an error message if you want
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <h2>Welcome to Student Tracker</h2>
      <p>Manage your courses, assignments, and grades all in one place.</p>

      {isLoaded && isSignedIn && <CourseSelector showQuickButtons={true} />}

      {isLoaded && !isSignedIn && (
        <>
          <h3>Available Courses</h3>

          {loading && <p>Loading courses...</p>}

          {!loading && courses.length === 0 && <p>No courses available yet.</p>}

          {!loading && courses.length > 0 && (
            <ul className="course-list">
              {courses.map((course) => (
                <li key={course.id} className="course-card">
                  <strong>{course.code}</strong>
                  <p>{course.name}</p>
                  {course.instructor && <p className="course-card__meta">{course.instructor}</p>}
                  <p className="course-card__meta">
                    {course.credits} credit{course.credits !== 1 ? 's' : ''}
                    {course.semester ? ` · ${course.semester}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <p style={{ marginTop: '1.5rem' }}>
            <strong>Sign in</strong> to manage your assignments, notes, and more.
          </p>
        </>
      )}
    </>
  );
}