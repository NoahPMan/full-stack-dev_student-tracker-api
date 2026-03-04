// src/pages/Assignments.tsx
// I.3 Chain: Component → useHomeworkCounts (presentation) → homeworkService (business) → homeworkRepository (data)

import CourseSelector from '../components/CourseSelector';
import HomeworkList from '../components/homework/HomeworkList';
import { useCourse } from '../context/CourseContext';
import { useHomeworkCounts } from '../hooks/useHomeworkCounts';

// Invisible probe that exercises the chain and renders nothing
function ChainProbe({ courseId }: { courseId?: string }) {
  // I.3 Chain: Hook (presentation) → homeworkService (business) → homeworkRepository (data)
  useHomeworkCounts(courseId);
  return null;
}

export default function Assignments() {
  const { selectedCourseId } = useCourse();

  return (
    <>
      <h2>Assignments</h2>
      <CourseSelector showQuickButtons={true} />
      {/* Exercises the chain with zero UI output */}
      <ChainProbe courseId={selectedCourseId} />
      <hr />
      <HomeworkList />
    </>
  );
}