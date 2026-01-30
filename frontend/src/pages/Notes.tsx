import { useState } from "react";
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

  return (
    <div>
      <h2>Notes</h2>
      <NoteForm onAdd={addNote} />
      <NoteList notes={notes} onRemove={removeNote} />
    </div>
  );
}