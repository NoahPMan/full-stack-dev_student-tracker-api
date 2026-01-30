import { useMemo, useState } from "react";
import NoteForm from "../components/notes/NoteForm";
import type { Note } from "../components/notes/NoteForm";
import NoteList from "../components/notes/NoteList";

export default function Notes() {
  const [notes, setNotes] = useState<Note[]>([]);

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
      <NoteForm onAdd={addNote} />
      <NoteList notes={displayNotes} onRemove={removeNote} onTogglePin={togglePin} />
    </div>
  );
}