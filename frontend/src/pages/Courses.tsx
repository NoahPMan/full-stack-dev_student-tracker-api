import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import CourseSelector from "../components/CourseSelector";
import { useCourse } from "../context/CourseContext";
import { useHomeworkCounts } from "../hooks/useHomeworkCounts";
import { useNotes } from "../hooks/useNotes";
import { useCourses, type Course } from "../hooks/useCourses";
import "./Courses.css";

function emojiFor(code: string) {
  const key = code.toUpperCase();
  if (key.includes("COMP") || key.includes("DEV")) return "💻";
  if (key.includes("DB") || key.includes("DATA")) return "🗄️";
  if (key.includes("NET")) return "🌐";
  if (key.includes("ARCH")) return "🏗️";
  if (key.includes("SEC")) return "🛡️";
  return "📘";
}

function DeleteCourseModal({
  open,
  course,
  counts,
  busy,
  onCancel,
  onConfirm,
}: {
  open: boolean;
  course: Course | null;
  counts: { assignmentsCount: number; notesCount: number } | null;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  if (!open || !course) return null;

  const a = counts?.assignmentsCount ?? 0;
  const n = counts?.notesCount ?? 0;
  const hasContent = a > 0 || n > 0;

  return (
    <div className="modal-backdrop" role="presentation" onMouseDown={onCancel}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        onMouseDown={(e) => e.stopPropagation()}
      >
        <h3 className="modal-title">Delete course?</h3>

        <p className="modal-text">
          <strong>{course.code}</strong> — {course.name}
        </p>

        {hasContent ? (
          <p className="modal-text">
            This course has <strong>{a}</strong> assignment{a === 1 ? "" : "s"} and{" "}
            <strong>{n}</strong> note{n === 1 ? "" : "s"}.
            <br />
            If you continue, assignments/notes will remain but become <strong>Unassigned</strong>.
          </p>
        ) : (
          <p className="modal-text">Are you sure you want to delete this course?</p>
        )}

        <div className="modal-actions">
          <button type="button" className="coursehub-btn" onClick={onCancel} disabled={busy}>
            Cancel
          </button>
          <button type="button" className="coursehub-btn danger" onClick={onConfirm} disabled={busy}>
            {busy ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseCard({
  course,
  isActive,
  onSelect,
  onOpenAssignments,
  onOpenNotes,
  onDelete,
}: {
  course: Course;
  isActive: boolean;
  onSelect: () => void;
  onOpenAssignments: () => void;
  onOpenNotes: () => void;
  onDelete: () => void;
}) {
  const counts = useHomeworkCounts(course.id);
  const notes = useNotes({ courseId: course.id });

  const pinned = useMemo(
    () => notes.list.filter((n: any) => !!n.pinned).length,
    [notes.list],
  );

  const progressPct = useMemo(() => {
    if (!counts.total) return 0;
    return Math.round((counts.done / counts.total) * 100);
  }, [counts.total, counts.done]);

  return (
    <article className={`coursehub-card${isActive ? " coursehub-card--active" : ""}`}>
      <header className="coursehub-card__header">
        <div className="coursehub-card__title">
          <span className="coursehub-card__emoji" aria-hidden>
            {emojiFor(course.code)}
          </span>
          <div>
            <div className="coursehub-card__code">{course.code}</div>
            <div className="coursehub-card__name">{course.name}</div>
          </div>
        </div>

        <div className="coursehub-card__header-actions">
          <button type="button" className="coursehub-card__select" onClick={onSelect}>
            {isActive ? "Selected" : "Select"}
          </button>
          <button
            type="button"
            className="coursehub-card__delete"
            onClick={onDelete}
            title="Delete course"
            aria-label="Delete course"
          >
            ✕
          </button>
        </div>
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
        <div
          className="coursehub-progress__bar"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={progressPct}
        >
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
  const { list, loading, error, createCourse, getSummary, deleteCourse } = useCourses();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [creating, setCreating] = useState(false);

  const [deleteOpen, setDeleteOpen] = useState(false);
  const [target, setTarget] = useState<Course | null>(null);
  const [counts, setCounts] = useState<{ assignmentsCount: number; notesCount: number } | null>(null);
  const [busy, setBusy] = useState(false);

  const selectedCourseObj = useMemo(
    () => list.find((c) => c.id === selectedCourseId),
    [list, selectedCourseId],
  );

  const selectionLabel = selectedCourseObj
    ? `${selectedCourseObj.code} — ${selectedCourseObj.name}`
    : "None";

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const c = code.trim();
    const n = name.trim();
    if (!c || !n) return;

    setCreating(true);
    try {
      await createCourse({ code: c, name: n });
      setCode("");
      setName("");
    } finally {
      setCreating(false);
    }
  }

  async function openDelete(course: Course) {
    setTarget(course);
    setCounts(null);
    setDeleteOpen(true);

    try {
      setCounts(await getSummary(course.id));
    } catch {
      setCounts({ assignmentsCount: 0, notesCount: 0 });
    }
  }

  async function confirmDelete() {
    if (!target) return;

    setBusy(true);
    try {
      await deleteCourse(target.id);
      if (selectedCourseId === target.id) setSelectedCourseId(undefined);
      setDeleteOpen(false);
      setTarget(null);
      setCounts(null);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="panel courseshub-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Courses</h2>
          <p className="page-subtitle">Create and manage your courses here.</p>
        </div>

        <div className="selection-meta" aria-live="polite">
          Current selection: <strong>{selectionLabel}</strong>
        </div>
      </header>

      <form className="course-create" onSubmit={onCreate}>
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Course code (e.g., COMP-3020)"
          required
        />
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Course name (e.g., Software Architecture)"
          required
        />
        <button type="submit" disabled={creating}>
          {creating ? "Adding..." : "Add course"}
        </button>
      </form>

      {loading && <p className="course-msg">Loading courses...</p>}
      {error && <p className="notes-error">{error}</p>}

      {!loading && !error && (
        <div className="coursehub-grid">
          {list.map((c) => (
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
              onDelete={() => openDelete(c)}
            />
          ))}
        </div>
      )}

      <div className="divider" />

      <div className="courseshub-selector">
        <CourseSelector showQuickButtons />
      </div>

      <DeleteCourseModal
        open={deleteOpen}
        course={target}
        counts={counts}
        busy={busy}
        onCancel={() => !busy && setDeleteOpen(false)}
        onConfirm={confirmDelete}
      />
    </section>
  );
}