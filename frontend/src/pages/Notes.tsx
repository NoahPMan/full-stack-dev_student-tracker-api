import { useEffect, useMemo, useState } from "react";
import NoteForm from "../components/notes/NoteForm";
import type { Note } from "../components/notes/NoteForm";
import NoteList from "../components/notes/NoteList";
import type { SharedCourseProps } from "../App";
import CourseSelector from "../components/CourseSelector";

const STORAGE_KEY = "student-tracker-notes";

export default function Notes({ activeCourse, setActiveCourse }: SharedCourseProps) {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw) as Note[];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch {
    }
  }, [notes]);

  const addNote = (note: Note) => {
    setNotes((prev) => [...prev, note]);
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n))
    );
  };

  const displayNotes = useMemo(() => {
    const pinned = notes.filter((n) => n.pinned);
    const unpinned = notes.filter((n) => !n.pinned);
    return [...pinned, ...unpinned];
  }, [notes]);

  return (
    <div>
      <h2>Notes</h2>

      <div style={{ marginBottom: "1.5rem" }}>
        <CourseSelector
          activeCourse={activeCourse}
          setActiveCourse={setActiveCourse}
          showQuickButtons={true}
        />
      </div>

      <div style={{ marginTop: "0.75rem" }}>
        <NoteForm onAdd={addNote} />
      </div>

      <NoteList notes={displayNotes} onRemove={removeNote} onTogglePin={togglePin} />
    </div>
  );
}
