import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import { useCourse } from "../context/CourseContext";
import { useHomeworkCounts } from "../hooks/useHomeworkCounts";
import { useNotes } from "../hooks/useNotes";
import "./Courses.css";

type CourseDef = { id: string; name: string; emoji: string };

const COURSES: CourseDef[] = [
  { id: "C-101", name: "Web Dev", emoji: "💻" },
  { id: "C-102", name: "Databases", emoji: "🗄️" },
  { id: "C-103", name: "Networking", emoji: "🌐" },
  { id: "C-104", name: "Software Architecture", emoji: "🏗️" },
];

function CourseCard({
  course,
  isActive,
  onSelect,
  onOpenAssignments,
  onOpenNotes,
}: {
  course: CourseDef;
  isActive: boolean;
  onSelect: () => void;
  onOpenAssignments: () => void;
  onOpenNotes: () => void;
}) {
  const counts = useHomeworkCounts(course.id);
  const notes = useNotes({ courseId: course.id });

  const pinned = useMemo(() => notes.list.filter((n: any) => !!n.pinned).length, [notes.list]);

  const progressPct = useMemo(() => {
    if (!counts.total) return 0;
    return Math.round((counts.done / counts.total) * 100);
  }, [counts.total, counts.done]);

  return (
    <article className={`coursehub-card${isActive ? " coursehub-card--active" : ""}`}>
      <header className="coursehub-card__header">
        <div className="coursehub-card__title">
          <span className="coursehub-card__emoji" aria-hidden>
            {course.emoji}
          </span>
          <div>
            <div className="coursehub-card__code">{course.id}</div>
            <div className="coursehub-card__name">{course.name}</div>
          </div>
        </div>

        <button type="button" className="coursehub-card__select" onClick={onSelect}>
          {isActive ? "Selected" : "Select"}
        </button>
      </header>

      <div className="coursehub-metrics">
        <div className="metric">
          <span className="metric__label">Assignments</span>
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

      <div className="coursehub-metrics two">
        <div className="metric">
          <span className="metric__label">Notes</span>
          <span className="metric__value">{notes.list.length}</span>
        </div>
        <div className="metric">
          <span className="metric__label">Pinned</span>
          <span className="metric__value">{pinned}</span>
        </div>
      </div>

      <div className="coursehub-progress">
        <div className="coursehub-progress__row">
          <span className="coursehub-progress__label">Progress</span>
          <span className="coursehub-progress__pct">{progressPct}%</span>
        </div>
        <div className="coursehub-progress__bar" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={progressPct}>
          <div className="coursehub-progress__fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      <div className="coursehub-actions">
        <button type="button" className="coursehub-btn primary" onClick={onOpenAssignments}>
          Open Assignments
        </button>
        <button type="button" className="coursehub-btn" onClick={onOpenNotes}>
          Open Notes
        </button>
      </div>
    </article>
  );
}

export default function Courses() {
  const navigate = useNavigate();
  const { selectedCourseId, setSelectedCourseId } = useCourse();

  const active = selectedCourseId ?? "None";

  return (
    <section className="panel courseshub-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Courses</h2>
          <p className="page-subtitle">Your course hub: progress, notes, and assignments by class.</p>
        </div>

        <div className="selection-meta" aria-live="polite">
          Current selection: <strong>{active}</strong>
        </div>
      </header>

      <div className="coursehub-grid">
        {COURSES.map((c) => (
          <CourseCard
            key={c.id}
            course={c}
            isActive={selectedCourseId === c.id}
            onSelect={() => setSelectedCourseId(c.id)}
            onOpenAssignments={() => {
              setSelectedCourseId(c.id);
              navigate("/assignments");
            }}
            onOpenNotes={() => {
              setSelectedCourseId(c.id);
              navigate("/notes");
            }}
          />
        ))}
      </div>

      <div className="divider" />

      <div className="courseshub-selector">
        <CourseSelector showQuickButtons={true} />
      </div>
    </section>
  );
}