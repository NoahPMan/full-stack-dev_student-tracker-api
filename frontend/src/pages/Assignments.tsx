import type { SharedCourseProps } from '../App';
import CourseSelector from '../components/CourseSelector';
import HomeworkList from '../components/homework/HomeworkList';
import { useHomeworkCounts } from '../hooks/useHomeworkCounts';

export default function Assignments({
  activeCourse,
  setActiveCourse,
}: SharedCourseProps) {
  const counts = useHomeworkCounts(activeCourse); // visible usage of the service via the new hook

  return (
    <>
    <h2>
    Assignments
        {
    !counts.loading && (
      <> — { counts.total } total(🟡 { counts.todo } · 🟠 { counts.inProgress } · ✅ { counts.done }) </>
        )
  }
  </h2>

    < CourseSelector
  activeCourse = { activeCourse }
  setActiveCourse = { setActiveCourse }
  showQuickButtons = { true}
    />

    <hr />

  {/* HomeworkList stays exactly as it is */ }
  <HomeworkList />
    </>
  );
}