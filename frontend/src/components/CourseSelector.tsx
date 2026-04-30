import { useEffect, useMemo } from "react";
import "./CourseSelector.css";
import { useCourse } from "../context/CourseContext";
import { useAuth } from "@clerk/clerk-react";
import { useCourses } from "../hooks/useCourses";
import { useLocation, useNavigate } from "react-router-dom";

export default function CourseSelector({ showQuickButtons = true }: { showQuickButtons?: boolean }) {
  const { selectedCourseId, setSelectedCourseId } = useCourse();
  const { isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const { list: courses, loading, error } = useCourses();

  const isCoursesPage = location.pathname === "/courses";

  const activeCourseObj = useMemo(
    () => courses.find((c) => c.id === selectedCourseId),
    [courses, selectedCourseId],
  );

  const activeLabel = activeCourseObj ? `${activeCourseObj.code} — ${activeCourseObj.name}` : "None";
  const hasSelectedCourse = !!selectedCourseId;

  // ✅ IMPORTANT: do NOT clear selection while the list is still loading
  useEffect(() => {
    if (!selectedCourseId) return;

    // Wait until we know the truth (fetch finished successfully)
    if (loading) return;
    if (error) return;

    // If there are no courses, don't auto-clear here (let UI guide the user)
    if (courses.length === 0) return;

    // Only clear if the course truly isn't in the loaded list
    const exists = courses.some((c) => c.id === selectedCourseId);
    if (!exists) setSelectedCourseId(undefined);
  }, [selectedCourseId, courses, loading, error, setSelectedCourseId]);

  if (!isLoaded || !isSignedIn) return null;

  return (
    <section className="course-selector">
      <p className="course-label">
        <strong>Active Course:</strong> {activeLabel}
      </p>

      {hasSelectedCourse && (
        <button type="button" className="course-clear" onClick={() => setSelectedCourseId(undefined)}>
          Clear
        </button>
      )}

      {loading && <p className="course-msg">Loading courses...</p>}

      {error && (
        <div className="course-error">
          <p className="course-error__text">Failed to fetch courses.</p>
          <p className="course-error__hint">Check backend is running and CORS allows your frontend URL.</p>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="course-empty">
          {isCoursesPage ? (
            <p className="course-msg">No courses yet. Use the form above to add one.</p>
          ) : (
            <>
              <p className="course-msg">No courses yet.</p>
              <button type="button" className="course-go-courses" onClick={() => navigate("/courses")}>
                Go to Courses to add one →
              </button>
            </>
          )}
        </div>
      )}

      {showQuickButtons && !loading && !error && courses.length > 0 && (
        <div className="course-buttons">
          {courses.map((course) => {
            const isActive = selectedCourseId === course.id;
            return (
              <button
                key={course.id}
                type="button"
                className={`course-button${isActive ? " active" : ""}`}
                onClick={() => setSelectedCourseId(course.id)}
                aria-pressed={isActive}
                disabled={isActive}
              >
                {course.code}
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
}
