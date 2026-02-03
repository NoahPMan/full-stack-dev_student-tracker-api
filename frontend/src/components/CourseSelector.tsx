import "./CourseSelector.css";

type Props = {
  activeCourse: string;
  setActiveCourse: (value: string) => void;
  showQuickButtons?: boolean;
};

export default function CourseSelector({
  activeCourse,
  setActiveCourse,
  showQuickButtons = true,
}: Props) {
  const hasSelectedCourse = activeCourse !== "None";

  const courses = ["Web Dev", "Databases", "Networking"];

  return (
    <section className="course-selector">
      <p className="course-label">
        <strong>Active Course:</strong> {activeCourse}
      </p>

      {hasSelectedCourse && (
        <button
          type="button"
          className="course-clear"
          onClick={() => setActiveCourse("None")}
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
                className={`course-button${isActive ? " active" : ""}`}
                onClick={() => setActiveCourse(course)}
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