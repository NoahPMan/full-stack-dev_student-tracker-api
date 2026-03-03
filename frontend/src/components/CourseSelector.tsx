import './CourseSelector.css';
import { useCourse } from '../context/CourseContext';

export default function CourseSelector({ showQuickButtons = true }: { showQuickButtons?: boolean }) {
  const { selectedCourseId, setSelectedCourseId } = useCourse();

  // Map course IDs to display names
  const courses = [
    { id: 'c101', label: 'Web Dev' },
    { id: 'c102', label: 'Databases' },
    { id: 'c103', label: 'Networking' },
    { id: 'c104', label: 'Software Architecture' },
  ];

  const activeCourse = selectedCourseId;
  const activeLabel =
    courses.find((c) => c.id === activeCourse)?.label ?? 'None';

  const hasSelectedCourse = !!activeCourse;

  return (
    <section className="course-selector">
      <p className="course-label">
        <strong>Active Course:</strong> {activeLabel}
      </p>

      {hasSelectedCourse && (
        <button
          type="button"
          className="course-clear"
          onClick={() => setSelectedCourseId(undefined)}
        >
          Clear
        </button>
      )}

      {showQuickButtons && (
        <div className="course-buttons">
          {courses.map((course) => {
            const isActive = activeCourse === course.id;

            return (
              <button
                key={course.id}
                type="button"
                className={`course-button${isActive ? ' active' : ''}`}
                onClick={() => setSelectedCourseId(course.id)}
                aria-pressed={isActive}
                disabled={isActive}
              >
                {course.label}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}