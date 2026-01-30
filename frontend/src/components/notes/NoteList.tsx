import type { Note } from "./NoteForm";

export default function NoteList({
  notes,
  onRemove,
}: {
  notes: Note[];
  onRemove: (id: string) => void;
}) {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          {note.text}
          <button onClick={() => onRemove(note.id)}>Remove</button>
        </li>
      ))}
    </ul>
  );
}