import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import { useCourse } from "../context/CourseContext";
import { useHomeworkCounts } from "../hooks/useHomeworkCounts";
import { useNotes } from "../hooks/useNotes";
import "./Home.css";

interface Course {
  id: string;
  code: string;
  name: string;
  credits: number;
  instructor?: string;
  semester?: string;
}

const API = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { selectedCourseId } = useCourse();

  // Guest course list
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCourses, setLoadingCourses] = useState(true);

  // Signed-in dashboard stats
  const counts = useHomeworkCounts(selectedCourseId);
  const notes = useNotes({ courseId: selectedCourseId });

  const noteCounts = useMemo(() => {
    const total = notes.list.length;
    const pinned = notes.list.filter((n: any) => !!n.pinned).length;
    return { total, pinned };
  }, [notes.list]);

  useEffect(() => {
    if (!isLoaded) return;
    if (isSignedIn) return;

    let cancelled = false;

    fetch(`${API}/api/v1/courses`)
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const list = Array.isArray(data) ? data : data?.data;
        if (Array.isArray(list)) setCourses(list);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoadingCourses(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return (
      <section className="panel home-page">
        <div className="home-hero">
          <div className="home-skel-title" />
          <div className="home-skel-line" />
          <div className="home-skel-line short" />
        </div>
      </section>
    );
  }

  return (
    <section className="panel home-page">
      <header className="home-hero">
        <div>
          <h2 className="home-hero__title">Welcome to Student Tracker</h2>
          <p className="home-hero__subtitle">
            Manage your courses, assignments, and notes in one place.
          </p>
        </div>

        {isSignedIn && (
          <div className="home-actions">
            <button className="home-action-btn primary" onClick={() => navigate("/assignments")}>
              Go to Assignments
            </button>
            <button className="home-action-btn" onClick={() => navigate("/notes")}>
              Go to Notes
            </button>
          </div>
        )}
      </header>

      {isSignedIn ? (
        <>
          <div className="home-controls">
            <CourseSelector showQuickButtons={true} />
            <div className="home-selected">
              Active Course: <strong>{selectedCourseId ?? "None"}</strong>
            </div>
          </div>

          <div className="home-grid">
            <div className="home-card">
              <div className="home-card__header">
                <h3>Assignments</h3>
                <span className="pill">Live</span>
              </div>

              <div className="home-metrics">
                <div className="metric">
                  <span className="metric__label">Total</span>
                  <span className="metric__value">{counts.total}</span>
                </div>
                <div className="metric">
                  <span className="metric__label">Todo</span>
                  <span className="metric__value">{counts.todo}</span>
                </div>
                <div className="metric">
                  <span className="metric__label">In progress</span>
                  <span className="metric__value">{counts.inProgress}</span>
                </div>
                <div className="metric">
                  <span className="metric__label">Done</span>
                  <span className="metric__value">{counts.done}</span>
                </div>
              </div>

              <button className="home-link-btn" onClick={() => navigate("/assignments")}>
                View assignments →
              </button>
            </div>

            <div className="home-card">
              <div className="home-card__header">
                <h3>Notes</h3>
                <span className="pill mint">Pinned</span>
              </div>

              <div className="home-metrics two">
                <div className="metric">
                  <span className="metric__label">Total</span>
                  <span className="metric__value">{noteCounts.total}</span>
                </div>
                <div className="metric">
                  <span className="metric__label">Pinned</span>
                  <span className="metric__value">{noteCounts.pinned}</span>
                </div>
              </div>

              <button className="home-link-btn" onClick={() => navigate("/notes")}>
                View notes →
              </button>
            </div>

            <div className="home-card span2">
              <div className="home-card__header">
                <h3>Quick tips</h3>
                <span className="pill">Workflow</span>
              </div>
              <ul className="home-tips">
                <li>Pick a course to filter assignments and notes.</li>
                <li>Move work from Todo → In progress → Done.</li>
                <li>Pin important notes to keep them at the top.</li>
              </ul>
            </div>
          </div>
        </>
      ) : (
        <div className="home-guest">
          <h3 className="home-guest__title">Available Courses</h3>

          {loadingCourses && <p className="home-msg">Loading courses...</p>}

          {!loadingCourses && courses.length === 0 && <p className="home-msg">No courses available yet.</p>}

          {!loadingCourses && courses.length > 0 && (
            <ul className="course-list">
              {courses.map((course) => (
                <li key={course.id} className="course-card">
                  <strong>{course.code}</strong>
                  <p>{course.name}</p>
                  {course.instructor && <p className="course-card__meta">{course.instructor}</p>}
                  <p className="course-card__meta">
                    {course.credits} credit{course.credits !== 1 ? "s" : ""}
                    {course.semester ? ` · ${course.semester}` : ""}
                  </p>
                </li>
              ))}
            </ul>
          )}

          <div className="home-cta">
            <p>
              <strong>Sign in</strong> to manage your assignments and notes.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}