import { useMemo } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import { useCourse } from "../context/CourseContext";
import { useHomeworkCounts } from "../hooks/useHomeworkCounts";
import { useNotes } from "../hooks/useNotes";
import "./Home.css";

export default function Home() {
  const { isSignedIn, isLoaded } = useAuth();
  const navigate = useNavigate();
  const { selectedCourseId } = useCourse();

  // Signed-in dashboard stats (filters by selected course UUID)
  const counts = useHomeworkCounts(selectedCourseId);
  const notes = useNotes({ courseId: selectedCourseId });

  const noteCounts = useMemo(() => {
    const total = notes.list.length;
    const pinned = notes.list.filter((n: any) => !!n.pinned).length;
    return { total, pinned };
  }, [notes.list]);

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

  // Signed out: marketing / CTA only (personal courses are private)
  if (!isSignedIn) {
    return (
      <section className="panel home-page">
        <header className="home-hero">
          <div>
            <h2 className="home-hero__title">Welcome to Student Tracker</h2>
            <p className="home-hero__subtitle">
              Sign in to create your own courses and track assignments and notes.
            </p>
          </div>
        </header>

        <div className="home-cta">
          <p>
            <strong>Sign in</strong> to manage your courses, assignments, and notes.
          </p>
        </div>
      </section>
    );
  }

  // Signed in: full dashboard
  return (
    <section className="panel home-page">
      <header className="home-hero">
        <div>
          <h2 className="home-hero__title">Welcome to Student Tracker</h2>
          <p className="home-hero__subtitle">
            Manage your courses, assignments, and notes in one place.
          </p>
        </div>

        <div className="home-actions">
          <button className="home-action-btn primary" onClick={() => navigate("/assignments")}>
            Go to Assignments
          </button>
          <button className="home-action-btn" onClick={() => navigate("/notes")}>
            Go to Notes
          </button>
        </div>
      </header>

      <div className="home-controls">
        {/* Single source of truth for Active Course display */}
        <CourseSelector showQuickButtons={true} />
      </div>

      <div className="home-grid">
        <div className="home-card">
          <div className="home-card__header">
            <h3>Assignments</h3>
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
          </div>
          <ul className="home-tips">
            <li>Start on the Courses page: add your classes first, then select one to begin tracking assignments and notes.</li>
            <li>Deleting a course won’t delete your work: related assignments/notes stay saved and become <strong>Unassigned</strong>.</li>
            <li>Move work from Todo → In progress → Done.</li>
            <li>Pin important notes to keep them at the top.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}