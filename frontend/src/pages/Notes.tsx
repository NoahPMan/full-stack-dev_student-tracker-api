import CourseSelector from "../components/CourseSelector";
import NoteForm from "../components/notes/NoteForm";
import NoteList from "../components/notes/NoteList";
import { useCourse } from "../context/CourseContext";
import { useNotes } from "../hooks/useNotes";
import "./Notes.css";

export default function Notes() {
  const { selectedCourseId } = useCourse();
  const { loading, error, list, add, update, remove, togglePin } = useNotes({
    courseId: selectedCourseId,
  });

  const pinnedCount = list.filter((n: any) => n.pinned).length;

  return (
    <section className="panel notes-page">
      <header className="page-header">
        <div>
          <h2 className="page-title">Notes</h2>
          <p className="page-subtitle">Capture and organize notes by course.</p>
        </div>

        <div className="summary-row" aria-live="polite">
          <span className="summary-chip">
            Total <strong>{list.length}</strong>
          </span>
          <span className="summary-chip">
            Pinned <strong>{pinnedCount}</strong>
          </span>
        </div>
      </header>

      <div className="notes-controls">
        <CourseSelector showQuickButtons />
      </div>

      <div className="divider" />

      <div className="notes-form-wrap">
        <NoteForm onAdd={add} />
      </div>

      {loading && <p className="notes-msg">Loading notes...</p>}
      {error && <p className="notes-error">{error}</p>}

      {!loading && !error && (
        <NoteList notes={list} onRemove={remove} onTogglePin={togglePin} onUpdate={update} />
      )}
    </section>
  );
}