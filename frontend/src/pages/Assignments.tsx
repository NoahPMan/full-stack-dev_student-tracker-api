// src/pages/Assignments.tsx
// I.3 Chain: Component → useHomeworkCounts (presentation) → homeworkService (business) → homeworkRepository (data)

import CourseSelector from '../components/CourseSelector';
import HomeworkList from '../components/homework/HomeworkList';
import { useCourse } from '../context/CourseContext';
import { useHomeworkCounts } from '../hooks/useHomeworkCounts';

function ChainProbe({ courseId }: { courseId?: string }) {
  useHomeworkCounts(courseId);
  return null;
}

export default function Assignments() {
  const { selectedCourseId } = useCourse();

  return (
    <>
    <h2>Assignments </h2>
    < CourseSelector showQuickButtons = { true} />
      <ChainProbe courseId={ selectedCourseId } />
        < hr />
        <HomeworkList />
        </>
  );
}