// src/pages/Courses.tsx
import CourseSelector from '../components/CourseSelector';
import { useCourse } from '../context/CourseContext';

export default function Courses() {
  const { selectedCourseId } = useCourse();

  return (
    <>
    <h2>Courses </h2>
    < p > Your enrolled courses will appear here.</p>

      < CourseSelector showQuickButtons = { true} />

        <p style={ { opacity: 0.85, marginTop: 8 } }>
          Current selection: { selectedCourseId ?? 'None' }
  </p>
    </>
  );
}