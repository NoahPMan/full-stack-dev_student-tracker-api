import { useState } from "react";
import type { FormEvent } from "react";
import { useCourse } from "../../context/CourseContext";
import type { NoteCreateInput } from "../../services/notesService";

type Props = { onAdd: (input: NoteCreateInput) => void };

export default function NoteForm({ onAdd }: Props) {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const { selectedCourseId } = useCourse();

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    const t = title.trim();
    const b = body.trim();
    if (!t || !b) return;

    if (!selectedCourseId) {
      alert("Select a course (top of page) before adding a note.");
      return;
    }

    onAdd({ courseId: selectedCourseId, title: t, body: b });
    setTitle("");
    setBody("");
  }

  return (
    <form
      onSubmit={handleSubmit}
      style={{ display: "flex", flexDirection: "column", gap: 8 }}
    >
      <input
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />
      <textarea
        placeholder="Note content"
        value={body}
        onChange={(e) => setBody(e.target.value)}
        required
      />
      <button type="submit">Add Note</button>
    </form>
  );
}
