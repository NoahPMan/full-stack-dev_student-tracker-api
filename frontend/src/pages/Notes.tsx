// src/pages/Notes.tsx
import { useEffect, useMemo, useState } from 'react';
import CourseSelector from '../components/CourseSelector';
import NoteForm from '../components/notes/NoteForm';
import NoteList from '../components/notes/NoteList';
import type { Note } from '../types/Note';

const STORAGE_KEY = 'student-tracker-notes';

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? (parsed as Note[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch { }
  }, [notes]);

  const addNote = (note: Note) => setNotes((prev) => [...prev, note]);
  const removeNote = (id: string) => setNotes((prev) => prev.filter((n) => n.id !== id));
  const togglePin = (id: string) =>
    setNotes((prev) => prev.map((n) => (n.id === id ? { ...n, pinned: !n.pinned } : n)));

  const displayNotes = useMemo(() => {
    const pinned = notes.filter((n) => !!n.pinned);
    const unpinned = notes.filter((n) => !n.pinned);
    return [...pinned, ...unpinned];
  }, [notes]);

  return (
    <div>
    <h2>Notes </h2>

    < div style = {{ marginBottom: '1.5rem' }
}>
  {/* T.4: reads/writes selected course via CourseContext; no props */ }
  < CourseSelector showQuickButtons />
    </div>

    < div style = {{ marginTop: '0.75rem' }}>
      {/* onAdd belongs to NoteForm (the child), not the Notes page */ }
      < NoteForm onAdd = { addNote } />
        </div>

        < NoteList
notes = { displayNotes }
onRemove = { removeNote }
onTogglePin = { togglePin }
  />
  </div>
  );
}