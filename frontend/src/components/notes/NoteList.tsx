import type { Note } from "./NoteForm";

export default function NoteList({
  notes,
  onRemove,
  onTogglePin,
}: {
  notes: Note[];
  onRemove: (id: string) => void;
  onTogglePin: (id: string) => void;
}) {
  return (
    <ul>
      {notes.map((note) => (
        <li key={note.id}>
          {note.text}{" "}
          <button type="button" onClick={() => onTogglePin(note.id)}>
            {note.pinned ? "Unpin" : "Pin"}
          </button>{" "}
          <button type="button" onClick={() => onRemove(note.id)}>
            Remove
          </button>
        </li>
      ))}
    </ul>
  );
}