/**
 * Notes page (UI layer)
 * Uses the Notes architecture chain:
 * useNotes (hook) -> notesService (business rules) -> notesRepository (data + test data)
 * This keeps the page focused on rendering and wiring up events, not data logic
 */
import CourseSelector from "../components/CourseSelector";
import NoteForm from "../components/notes/NoteForm";
import NoteList from "../components/notes/NoteList";
import { useCourse } from "../context/CourseContext";
import { useNotes } from "../hooks/useNotes";

export default function Notes() {
  const { selectedCourseId } = useCourse();
  const { loading, error, list, add, remove, togglePin } = useNotes({
    courseId: selectedCourseId,
  });

  return (
    <div>
      <h2>Notes</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <CourseSelector showQuickButtons />
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <NoteForm onAdd={add} />
      </div>

      {loading && <p>Loading notes...</p>}
      {error && <p style={{ color: "crimson" }}>{error}</p>}

      {!loading && !error && (
        <NoteList notes={list} onRemove={remove} onTogglePin={togglePin} />
      )}
    </div>
  );
}