// src/components/CourseSelector.tsx
import './CourseSelector.css';
import { useCourse } from '../context/CourseContext';

export default function CourseSelector({ showQuickButtons = true }: { showQuickButtons?: boolean }) {
  const { selectedCourseId, setSelectedCourseId } = useCourse();
  const activeCourse = selectedCourseId ?? 'None';
  const hasSelectedCourse = activeCourse !== 'None';
  const courses = ['Web Dev', 'Databases', 'Networking'];

  return (
    <section className="course-selector">
      <p className="course-label">
        <strong>Active Course:</strong> {activeCourse}
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
            const isActive = activeCourse === course;
            return (
              <button
                key={course}
                type="button"
                className={`course-button${isActive ? ' active' : ''}`}
                onClick={() => setSelectedCourseId(course)}
                aria-pressed={isActive}
                disabled={isActive}
              >
                {course}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}