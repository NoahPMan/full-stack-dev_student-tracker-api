import CourseSelector from '../components/CourseSelector';
import HomeworkList from '../components/homework/HomeworkList';
import { useCourse } from '../context/CourseContext';
import { useHomeworkCounts } from '../hooks/useHomeworkCounts';
import { useAuth } from '@clerk/clerk-react';

function ChainProbe({ courseId }: { courseId?: string }) {
  useHomeworkCounts(courseId);
  return null;
}

export default function Assignments() {
  const { selectedCourseId } = useCourse();
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return <p>Loading...</p>;
  if (!isSignedIn) return <p>Sign in to view assignments.</p>;

  return (
    <>
      <h2>Assignments</h2>
      <CourseSelector showQuickButtons={true} />
      <ChainProbe courseId={selectedCourseId} />
      <hr />
      <HomeworkList />
    </>
  );
}